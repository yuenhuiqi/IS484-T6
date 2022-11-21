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
  score: any = 0;
  merit: any;
  demerit: any;
  sorted: any = [];
  docTitleDict: any = {};

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
      this.encodedQuery = params['query']
      this.query = decodeURIComponent(params['query']);
    });

    this.getAcronym()
    this.http.get<any>(`http://localhost:2222/getSuggestedQueries/` + this.query).subscribe(
      data => {this.relevantSearches = data.suggestedSearches}
    )

    this.http.post<any>(`https://18.142.140.202/search`, {"query": this.query})
    .subscribe(
      data => { 
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
          this.managefeedback.getFeedback(this.query, this.docID)
          .subscribe((res:any )=> { 
           
            // console.log(res[0]+"this my feedback")
            if (res.code ==200){
              console.log(res.data)
              // // console.log(docName)
              this.merit = res.data.merit
              this.demerit = res.data.demerit
              if (this.merit > this.demerit){
                this.score = this.score + this.score*2*Math.log(1+this.merit-this.demerit)
                // console.log("going through!!")
              } else {
                this.score = this.score- this.score*2*Math.log(1+this.demerit-this.merit)
                // console.log("going through 2222")
              }

            }
            
            // console.log(this.docDict)
          }, err => {
            // console.log("gg got error calling feedback")
            console.log(err)});

          this.manageDocs.getDocDetails(data.documents[i].meta.doc_uuid)
          .subscribe(res => { 
            this.docTitleDict[data.documents[i].meta.doc_uuid] = (<any>res).docTitle
          }, err => console.log(err));
          if (Object.keys(this.docDict).includes(data.documents[i].meta.doc_uuid)) {
            this.docDict[data.documents[i].meta.doc_uuid].push([data.documents[i].meta.page, data.documents[i].content])
            this.scores[data.documents[i].meta.doc_uuid] += this.score
            console.log("miscore"+this.score)
            console.log(this.docDict)
          } else {
            this.docDict[data.documents[i].meta.doc_uuid] = [[data.documents[i].meta.page, data.documents[i].content]]
            this.scores[data.documents[i].meta.doc_uuid] = this.score
            console.log("miscore"+this.score)
            console.log(this.docDict)
          }
        }
        this.score=0
        console.log(this.docDict)
        for (let doc in this.scores){
          
          this.scores[doc] = this.scores[doc]/3
          console.log("hereeee we are"+this.scores[doc])

        }

        Object.keys(this.scores)
          .sort((a, b) => (this.scores[a] < this.scores[b] ? 1 : -1))
          .map(x => {
            console.log("MEEEEEEp")
            console.log(x, this.scores[x]);
            this.sorted.push(x);
            
          });

        console.log("check!!")
        console.log(this.sorted)
        for (let j in data.answers) {
          if (Object.keys(this.answers).includes(data.documents[j].meta.doc_uuid)) {
            this.answers[data.documents[j].meta.doc_uuid].push(data.answers[j].answer)
          } else {
            this.answers[data.documents[j].meta.doc_uuid] = [data.answers[j].answer]
          }
          console.log(this.answers)
          // this.answers.push([data.answers[j].answer])
        }
      }
    )

    this.getSuggestedQuery("")

    this.newquery.valueChanges.subscribe(val => {
      this.getSuggestedQuery(val)
    })

  }

  viewDocument(docID: any): void {
    this.managefeedback.addFeedbackCount(this.query.replace('?', ''), docID)
    .subscribe(res => {
      window.open(`/uploader/viewdocument/${docID}/${this.query.replace('?', '')}/view`)
      console.log(res)
    });
  
  }

  toPage(docID:any, pageNo: any): void {
    this.managefeedback.addFeedbackCount(this.query.replace('?', ''), docID)
    .subscribe(res => {
      window.open(`/uploader/viewdocument/${docID}/${this.query.replace('?', '')}/${pageNo}`)
      console.log(res)
    });
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
