import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ManageSearchQueryService } from '../../service/manage-search-query.service';
import { ManageDocsService } from '../../service/manage-docs.service';

@Component({
  selector: 'app-view-results-process',
  templateUrl: './view-results-process.component.html',
  styleUrls: ['./view-results-process.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewResultsProcessComponent implements OnInit {
  panelOpenState = false;
  sub: any;
  query: any;
  docArr: any;
  docDict: any = {};
  found_acronyms: any = []
  relevantSearches: any;

  constructor(private route: ActivatedRoute, 
                private http: HttpClient, 
                private manageSearchQueryService: ManageSearchQueryService, 
                private router: Router,
                private manageDocs: ManageDocsService
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


    this.http.get<any>(`http://localhost:2222/getSuggestedQueries/` + this.query).subscribe(
      data => {this.relevantSearches = data.suggestedSearches}
    )

    this.http.post<any>(`https://18.142.140.202/search`, {"query": this.query})
    .subscribe(
      data => { 
        // console.log(data)
        for (let i in data.documents) {
          // console.log(data.documents)
          if (Object.keys(this.docDict).includes(data.documents[i].meta.doc_uuid)) {
            this.docDict[data.documents[i].meta.doc_uuid].push([data.documents[i].meta.page, data.documents[i].content])
          } else {
            this.docDict[data.documents[i].meta.doc_uuid] = [[data.documents[i].meta.page, data.documents[i].content]]
          }
          }
        }
    )

    this.http.get<any>(`http://localhost:2222/getAllAcronyms`)
    .subscribe(
      data => {
        // console.log(data)
        for (let i in data.acronyms) {
          // console.log(data.acronyms[i])
          if (i < data.acronyms.length) {
            // console.log(this.query)
            var words = this.query.split(' ')
            
            for (let j in words) {
              // console.log(words[j])
              // console.log(data.acronyms[i].acronym)
              if (words[j].toLowerCase() == (data.acronyms[i].acronym.toLowerCase())) {
                // console.log(data.acronyms[i].meaning)
                this.found_acronyms.push({
                  'acronym': data.acronyms[i].acronym,
                  'meaning': data.acronyms[i].meaning
                })
                console.log(this.found_acronyms)
                // this.found_acronym.push(words[j])
                // this.found_acronym_meaning.push(data.acronyms[i].meaning)
              } else {
                console.log("Next Please")
              }
            }
          }
          
        }
      }
    )

    // this.getAllDocDetails()

    this.getSuggestedQuery("")

    this.newquery.valueChanges.subscribe(val => {
      this.getSuggestedQuery(val)
    })

  }

  docDetails: any = {}

  dataSource = [];


  viewDocument(docID: any): void {
    window.open(`/uploader/viewdocument/${docID}`)
  }

  getSuggestedQuery(qn:string) {
    this.manageSearchQueryService.getSearchQuery(qn)
    .subscribe(res => {
      console.log(res)
      this.filtered = res
      this.suggestedQueries.next(this.filtered.data.queryList);
    });
  }

  submit() {
    this.searchQuery = this.newquery.value
    console.log(this.newquery.value)
    this.manageSearchQueryService.addQueryCount(this.newquery.value)
    .subscribe(res => {
      console.log(res)
    });
    this.router.navigate(['/viewresultsprocess/' + this.searchQuery])
      .then(() => {
        window.location.reload();
      });
  }

}
