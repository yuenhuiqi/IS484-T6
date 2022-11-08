import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ManageSearchQueryService } from '../../service/manage-search-query.service';
import { ManageDocsService } from '../../service/manage-docs.service';
import { ManageFeedbackServiceService } from '../../service/manage-feedback-service.service';

@Component({
  selector: 'app-view-results-process',
  templateUrl: './view-results-process.component.html',
  styleUrls: ['./view-results-process.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewResultsProcessComponent implements OnInit {
  panelOpenState = false;
  sub: any;
  encodedQuery: any;
  query: any;
  docArr: any;
  docDict: any = {};
  found_acronyms: any = []
  relevantSearches: any;
  answers: any = [];
  name: any;
  scores: any = {};
  docID: any;
  score: any;
  merit: any;
  demerit: any;

  constructor(private route: ActivatedRoute, 
                private http: HttpClient, 
                private manageSearchQueryService: ManageSearchQueryService, 
                private router: Router,
                private manageDocs: ManageDocsService,
                private managefeedback: ManageFeedbackServiceService
              ) { }

  newquery = new FormControl();
  suggestedQueries = new BehaviorSubject<any>([]);

  filtered:any;
  searchQuery: any;


  ngOnInit(): void {
    if (localStorage.getItem('reload') == null || localStorage.getItem('reload') == '0') {
      localStorage.setItem('reload', '1')
      location.reload()
    } else {
      if (localStorage.getItem('reload') == '1') {
        localStorage.setItem('reload', '0')
      }
    }

    this.sub = this.route.params.subscribe(params => {
      this.query = decodeURIComponent(params['query']);
      this.encodedQuery = encodeURIComponent(this.query)
    });



    this.getAcronym()

    console.log(this.encodedQuery)
    this.http.get<any>(`http://localhost:2222/getSuggestedQueries/` + this.encodedQuery).subscribe(
      data => {this.relevantSearches = data.suggestedSearches}
    )





    this.http.post<any>(`https://18.142.140.202/search`, {"query": this.query})


    .subscribe(
      data => { 
        console.log(data)
        for (let i in data.documents) {
          console.log(data.documents)
          this.docID = data.documents[i].meta.doc_uuid

          this.score = data.documents[i].score

          this.manageDocs.getDocDetails(this.docID)
          .subscribe(res => { 
            // this.name = (<any>res).docTitle
            // this.docNameList.push((<any>res).docTitle)

            // console.log(docName)
            //calculate
            // // console.log(docName)

            this.docDict[data.documents[i].meta.doc_uuid][i].push((<any>res).docTitle)
            // console.log(this.docNameList)
            // console.log(this.docDict)
          }, err => console.log(err));

          // Get the feedback and calculate scores
          this.http.get<any>(`https://localhost:2222/getFeedback/`+ this.docID+"/"+this.query)
          .subscribe(res => { 

            if (res.code ==200){

              // // console.log(docName)
              this.merit = res.data.merit
              this.demerit = res.data.demerit
              if (this.merit > this.demerit){
                this.score = this.score + this.score*2*Math.log(1+this.merit-this.demerit)
              } else {
                this.score = this.score- this.score*2*Math.log(1+this.demerit-this.merit)
              }

            }
            // console.log(this.docNameList)
            // console.log(this.docDict)
          }, err => console.log(err));

          if (Object.keys(this.docDict).includes(data.documents[i].meta.doc_uuid)) {
            this.docDict[data.documents[i].meta.doc_uuid].push([data.documents[i].meta.page, data.documents[i].content, this.score])
          } else {
            this.docDict[data.documents[i].meta.doc_uuid] = [[data.documents[i].meta.page, data.documents[i].content, this.score]]
          }
          console.log(this.docDict)

          ////// REFERENCE FOR ORDERING!! (Need to order docDict)
        //   this.docDict.sort(function(first, second) {
        //     return (first.score - second.tedad);
        // });
        // console.log(this.sample);
        }
        for (let j in data.answers) {
          // console.log(data.answers[j].answer)
          this.answers.push([data.answers[j].answer])
        }
        }
    )





    this.getSuggestedQuery("")

    this.newquery.valueChanges.subscribe(val => {
      this.getSuggestedQuery(val)
    })

  }

  viewDocument(docID: any): void {
    this.managefeedback.addFeedbackCount(this.query, docID)
    .subscribe(res => {
      console.log(res)
    });
    window.open(`/uploader/viewdocument/${docID}/${this.query}`)
  }

  getSuggestedQuery(qn:string) {
    qn = encodeURIComponent(qn)
    this.manageSearchQueryService.getSearchQuery(qn)
    .subscribe(res => {
      console.log(res)
      this.filtered = res
      this.suggestedQueries.next(this.filtered.data.queryList);
    });
  }

  getAcronym() {
    console.log(this.encodedQuery)
    this.http.get<any>(`http://localhost:2222/getAllAcronyms/` + this.encodedQuery)
    .subscribe(
      data => {
        for (let i in data.acronyms) {
          this.found_acronyms.push({
            'acronym': data.acronyms[i].acronym,
            'meaning': data.acronyms[i].meaning
          })
        }
        console.log(this.found_acronyms)
      })

  }

  // getDocName(docID: any): void {
  //   this.manageDocs.getDocDetails(docID)
  //   .subscribe(res => { 
  //     this.name = (<any>res).docTitle
  //     // this.docNameList.push((<any>res).docTitle)
  //     // // console.log(docName)
  //     // // this.docDict[data.documents[i].meta.doc_uuid][i].push((<any>res).docTitle)
  //     // console.log(this.docNameList)
  //     // console.log(this.docDict)
  //   }, err => console.log(err));
  //   return this.name
  // }


  submit() {
    this.searchQuery = this.newquery.value
    console.log(this.newquery.value)
    let query = encodeURIComponent(this.searchQuery)
    this.manageSearchQueryService.addQueryCount(query)
    .subscribe(res => {
      console.log(res)
    });
    this.router.navigate(['/viewresultsprocess/' + query])
      .then(() => {
        window.location.reload();
      });
  }

}
