import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { ManageSearchQueryService } from '../../service/manage-search-query.service';

@Component({
  selector: 'app-reader-home',
  templateUrl: './reader-home.component.html',
  styleUrls: ['./reader-home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ReaderHomeComponent implements OnInit {

  constructor(private manageSearchQueryService: ManageSearchQueryService) { }

  query = new FormControl();
  suggestedQueries = new BehaviorSubject<any>([]);

  filtered:any;

  ngOnInit(): void {
    this.getSuggestedQuery("")

    this.query.valueChanges.subscribe(val => {
      this.getSuggestedQuery(val)
    });
  }

  getSuggestedQuery(qn:string) {
    this.manageSearchQueryService.getSearchQuery(qn)
    .subscribe(res => {
      console.log(res)
      this.filtered = res
      this.suggestedQueries.next(this.filtered.data.course);
    });
  }

}
