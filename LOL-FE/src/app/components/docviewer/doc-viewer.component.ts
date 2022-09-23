import { Component, OnInit } from '@angular/core';  
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

  
@Component({  
  selector: 'app-docviewer',  
  templateUrl: './doc-viewer.component.html',  
  styleUrls: ['./doc-viewer.component.css']  
})  
export class ViewDocumentComponent implements OnInit {  

  sub: any;
  docID: any;
  docLink: any;
  

  constructor(private route: ActivatedRoute, private http: HttpClient) { }  
  
  ngOnInit(): void {

    this.sub = this.route.params.subscribe(params => {
      this.docID = params['id'];
    });
    
    this.http.get<any>(`http://localhost:2222/presignedUrl/` + this.docID)
      .subscribe(
        data => { this.docLink = data.presignedUrl }
      )

  }

  showModal = -1; 

  show(index: number){
    this.showModal= index;
  }

  close(){
    this.showModal = -1; 
  }

}  

