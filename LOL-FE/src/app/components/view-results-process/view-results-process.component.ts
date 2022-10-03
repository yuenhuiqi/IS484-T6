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

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.query = decodeURIComponent(params['query']);
    });

    this.http.post<any>(`http://18.142.140.202/search`, {"query": this.query})
    .subscribe(
      data => { console.log(data.documents) }
    )
  }

}
