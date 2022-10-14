import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ManageSearchQueryService } from '../../service/manage-search-query.service';

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

  constructor(private route: ActivatedRoute, 
                private http: HttpClient, 
                private manageSearchQueryService: ManageSearchQueryService, 
                private router: Router
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

    this.http.post<any>(`http://18.142.140.202/search`, {"query": this.query})
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

    this.getSuggestedQuery("")

    this.newquery.valueChanges.subscribe(val => {
      this.getSuggestedQuery(val)
    });

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
    
    this.router.navigate(['/viewresultsprocess/' + this.searchQuery]);
  }

}
