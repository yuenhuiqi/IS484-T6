import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http';

import { ManageSearchQueryService } from '../../service/manage-search-query.service';

@Component({
  selector: 'app-reader-home',
  templateUrl: './reader-home.component.html',
  styleUrls: ['./reader-home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ReaderHomeComponent implements OnInit {

  constructor(private manageSearchQueryService: ManageSearchQueryService, 
              private router: Router,
              private http: HttpClient
               ) { }

  query = new FormControl();
  suggestedQueries = new BehaviorSubject<any>([]);

  filtered:any;
  searchQuery: any;
  found_acronyms: any = []

  ngOnInit(): void {
    this.getSuggestedQuery("")

    this.query.valueChanges.subscribe(val => {
      this.getSuggestedQuery(val)
    });

    this.http.get<any>(`http://54.254.54.186:2222/getAllAcronyms`)
    .subscribe(
      data => {
        // console.log(data)
        for (let i in data.acronyms) {
          // console.log(data.acronyms[i])
          if (i < data.acronyms.length) {
            // console.log(this.query)
            var words = this.searchQuery.split(' ')
            
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
    this.searchQuery = this.query.value
    // console.log(this.query.value)
    this.manageSearchQueryService.addQueryCount(this.query.value)
    .subscribe(res => {
      console.log(res)
    });

    this.router.navigate(['/viewresultsprocess/' + this.searchQuery]);
  }

}
