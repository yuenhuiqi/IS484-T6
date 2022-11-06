import { Component, OnInit,  } from '@angular/core';  
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../service/auth.service'
import { ManageFeedbackServiceService } from '../../service/manage-feedback-service.service';
  
@Component({  
  selector: 'app-docviewer',  
  templateUrl: './doc-viewer.component.html',  
  styleUrls: ['./doc-viewer.component.css']  
})  
export class ViewDocumentComponent implements OnInit {  

  sub: any;
  docID: any;
  docLink: any;
  toggleClose = 1;
  docType: any;
  token = localStorage.getItem('token');
  userRole: String = "";
  public feedback: any = {};
  searchID: any = 1;
  score: any = 0;

  constructor(
    private user: AuthService, 
    private route: ActivatedRoute, 
    private http: HttpClient,
    private managefeedback: ManageFeedbackServiceService
  ) {   }  
  
  ngOnInit(): void {
    if (this.route.snapshot.routeConfig?.path && this.route.snapshot.routeConfig?.path === "uploader/viewdocument/:id") {
      this.toggleClose = 1;
    }

    this.sub = this.route.params.subscribe(params => {
      this.docID = params['id'];
    });
    
    this.http.get<any>(`http://localhost:2222/presignedUrl/` + this.docID)
      .subscribe(
        data => { this.docLink = data.presignedUrl }
      )

    this.http.get<any>(`http://localhost:2222/getDocDetails/` + this.docID)
    .subscribe(
      data => { this.docType = data.docType 
      }
    )

    this.getUserName()


  }

  getUserName() {
    this.user.getUser(this.token)
      .subscribe(
        res => { 
          this.userRole = (<any>res).role
        }, 
        err => console.log(err)
      )
  }

  displayStyle = "block";
  
  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }

  submitPositive() {
    this.score = 1
    this.displayStyle = "none";
    // console.log(this.docID)
    this.managefeedback.addFeedbackCount(this.searchID, this.docID)
    .subscribe(res => {
      console.log(res)
    });

    this.managefeedback.updateFeedback(this.searchID, this.docID, this.score)
    .subscribe(res => {
      console.log(res)
    });

  }

  submitNegative() {
    this.score = 0
    this.displayStyle = "none";

    this.managefeedback.addFeedbackCount(this.searchID, this.docID)
    .subscribe(res => {
      console.log(res)
    });

    this.managefeedback.updateFeedback(this.searchID, this.docID, this.score)
    .subscribe(res => {
      console.log(res)
    });
  }


}  


