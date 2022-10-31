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
      this.query = decodeURIComponent(params['query']);
    });

    this.getAcronym()
<<<<<<< HEAD
    this.http.get<any>(`http://localhost:2222/getSuggestedQueries/` + this.query).subscribe(
=======

    console.log(this.encodedQuery)
    this.http.get<any>(`https://54.254.54.186:2222/getSuggestedQueries/` + this.encodedQuery).subscribe(
>>>>>>> a121583 (Testing endpoint)
      data => {this.relevantSearches = data.suggestedSearches}
    )

    this.http.post<any>(`https://18.142.140.202/search`, {"query": this.query})
    .subscribe(
      data => { 
        for (let i in data.documents) {
          this.manageDocs.getDocDetails(data.documents[i].meta.doc_uuid)
          .subscribe(res => { 
            this.docTitleDict[data.documents[i].meta.doc_uuid] = (<any>res).docTitle
          }, err => console.log(err));
          if (Object.keys(this.docDict).includes(data.documents[i].meta.doc_uuid)) {
            this.docDict[data.documents[i].meta.doc_uuid].push([data.documents[i].meta.page, data.documents[i].content])
          } else {
            this.docDict[data.documents[i].meta.doc_uuid] = [[data.documents[i].meta.page, data.documents[i].content]]
          }
        }
        for (let j in data.answers) {
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
    this.http.get<any>(`https://54.254.54.186:2222/getAllAcronyms/` + this.encodedQuery)
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
