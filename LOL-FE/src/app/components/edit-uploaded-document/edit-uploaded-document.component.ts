import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManageDocsService } from '../../service/manage-docs.service';



@Component({
  selector: 'app-edit-uploaded-document',
  templateUrl: './edit-uploaded-document.component.html',
  styleUrls: ['./edit-uploaded-document.component.css']
})
export class EditUploadedDocumentComponent implements OnInit {

  constructor(private manageDocs: ManageDocsService, private route: ActivatedRoute, private http: HttpClient, private snackbar: MatSnackBar) { }

  sub: any;
  docID: any;
  docTitle: any;
  editDocData: any;

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.docID = params['id'];
    });

    this.manageDocs.getDocDetails(this.docID)
      .subscribe(
        (data:any) => { 
          this.docTitle = data.docTitle
          this.editDocData = { 'journey': data.journey.toLowerCase(), 'docTitle': this.docTitle}
        }
      )
  }

  editUploadedDoc(): void {
    console.log(this.editDocData.docTitle)
    this.manageDocs.updateDoc(this.docID, this.editDocData.docTitle, this.editDocData.journey)
      .subscribe((data:any) => {
        if (data.code == 200) {
          this.snackbar.open(data.message, '', {
            duration: 1500,
            verticalPosition: "top"
          })
            .afterDismissed().subscribe(() => location.assign('/uploader'))
        }
      })
  }
}
