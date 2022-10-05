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

    
  }

}
