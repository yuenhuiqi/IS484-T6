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
  toggleClose = 0;
  docType: any;
  

  constructor(private route: ActivatedRoute, private http: HttpClient) {   }  
  
  ngOnInit(): void {
    if (this.route.snapshot.routeConfig?.path && this.route.snapshot.routeConfig?.path === "uploader/viewdocument/:id") {
      this.toggleClose = 1;
    }

    this.sub = this.route.params.subscribe(params => {
      this.docID = params['id'];
    });
    
    this.http.get<any>(`https://54.254.54.186:2222/presignedUrl/` + this.docID)
      .subscribe(
        data => { this.docLink = data.presignedUrl }
      )

    this.http.get<any>(`https://54.254.54.186:2222/getDocDetails/` + this.docID)
    .subscribe(
      data => { this.docType = data.docType 
      }
    )


  }

  showModal = -1; 

  show(index: number){
    this.showModal= index;
  }

  close(){
    // this.showModal = -1; 
    this.toggleClose = 1;
  }

}  

