import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-results-process',
  templateUrl: './view-results-process.component.html',
  styleUrls: ['./view-results-process.component.css']
})
export class ViewResultsProcessComponent implements OnInit {
  panelOpenState = false;
  sub: any;
  query: any;
  docArr: any;
  docDict: any = {};

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

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
    });

<<<<<<< Updated upstream
    this.http.post<any>(`http://18.142.140.202/search`, {"query": this.query})
=======
    this.getAcronym()

    console.log(this.encodedQuery)
    this.http.get<any>(`http://localhost:2222/getSuggestedQueries/` + this.encodedQuery).subscribe(
      data => {this.relevantSearches = data.suggestedSearches}
    )



    this.http.post<any>(`https://18.142.140.202/search`, {"query": this.query})
>>>>>>> Stashed changes
    .subscribe(
      data => { 
        // console.log(data)
        for (let i in data.documents) {
<<<<<<< Updated upstream
          // console.log(data.documents)
=======
          console.log(data.documents)
          this.manageDocs.getDocDetails(data.documents[i].meta.doc_uuid)
          .subscribe(res => { 
            // this.name = (<any>res).docTitle
            // this.docNameList.push((<any>res).docTitle)
            // console.log(docName)
            //calculate
            searchID, docID, score
            score = data.documents[i].meta.score

            this.docDict[data.documents[i].meta.doc_uuid][i].push((<any>res).docTitle)
            // console.log(this.docNameList)
            // console.log(this.docDict)
          }, err => console.log(err));

>>>>>>> Stashed changes
          if (Object.keys(this.docDict).includes(data.documents[i].meta.doc_uuid)) {
            this.docDict[data.documents[i].meta.doc_uuid].push([data.documents[i].meta.page, data.documents[i].content])
          } else {
            this.docDict[data.documents[i].meta.doc_uuid] = [[data.documents[i].meta.page, data.documents[i].content]]
          }
          }
        }
    )

<<<<<<< Updated upstream
=======

    this.http.get<any>(`http://localhost:2222/getSuggestedQueries/` + this.query+'/'+).subscribe(
      data => {this.relevantSearches = data.suggestedSearches}
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
>>>>>>> Stashed changes
    
  }

}
