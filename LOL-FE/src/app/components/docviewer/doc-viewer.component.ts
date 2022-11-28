import { Component, OnInit,  } from '@angular/core';  
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../service/auth.service'
import { ManageFeedbackServiceService } from '../../service/manage-feedback-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogData, SuggestedSearchesComponent } from '../suggested-searches/suggested-searches.component';
import { MatDialog } from '@angular/material/dialog';
  
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
  score: any = 0;
  queryID: any;
  result: any;
  relevantSearches: any;
  type: any;

  constructor(
    private user: AuthService, 
    private route: ActivatedRoute, 
    private http: HttpClient,
    private managefeedback: ManageFeedbackServiceService,
    private snackbar: MatSnackBar,
    public dialog: MatDialog
  ) {   }  
  
  ngOnInit(): void {
    if (this.route.snapshot.routeConfig?.path && this.route.snapshot.routeConfig?.path === "uploader/viewdocument/:did/:qid/:type") {
      this.toggleClose = 1;
    }

    this.sub = this.route.params.subscribe(params => {
      this.docID = params['did'];
      this.queryID = params['qid']
      this.type = params['type']
    });
    
    this.http.get<any>(`http://localhost:2222/presignedUrl/` + this.docID)
      .subscribe(
        data => { 
          if (this.type == 'view') {
            this.docLink = data.presignedUrl 
          } else {
            this.docLink = data.presignedUrl + "#page=" + String(this.type) 
          }
        }
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

    this.managefeedback.updateFeedback(this.queryID, this.docID, this.score)
    .subscribe(res => {
      console.log(res)
    });

  }

  submitNegative() {
    this.score = 0
    this.displayStyle = "none";

    this.managefeedback.updateFeedback(this.queryID, this.docID, this.score)
    .subscribe(res => {
      console.log(res)
    });

    this.http.get<any>(`http://localhost:2222/getSuggestedQueries/` + this.queryID).subscribe(
      data => {this.relevantSearches = data.suggestedSearches
        const message = `Do you want to search for these instead?`;
        const dialogData = new DialogData(this.relevantSearches, message);
        const dialogRef = this.dialog.open(SuggestedSearchesComponent, {
          maxWidth: "500px",
          maxHeight: "1000px",
          data: dialogData
        });
        dialogRef.afterClosed().subscribe((dialogResult:any) => {
          this.result = dialogResult;
          console.log(this.result)
    
          if (this.result == false) {
            location.reload()
          } 
    
        });
      }
    )




  }


}  


