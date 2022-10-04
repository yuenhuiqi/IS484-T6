import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManageDocsService } from '../../service/manage-docs.service';
import { ManageVersioningService } from '../../service/manage-versioning.service';


@Component({
  selector: 'app-edit-uploaded-document',
  templateUrl: './edit-uploaded-document.component.html',
  styleUrls: ['./edit-uploaded-document.component.css']
})
export class EditUploadedDocumentComponent implements OnInit {

  constructor(private manageVersion: ManageVersioningService, private manageDocs: ManageDocsService, private route: ActivatedRoute, private http: HttpClient, private snackbar: MatSnackBar) { }

  sub: any;
  docID: any;
  docTitle: any;
  editDocData: any;

  displayedColumns: string[] = ['docName', 'lastUpdated', 'uploaderName']
  dataSource = [];

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.docID = params['id'];
    });

    this.getDetails()
    this.getVersions()
  }

  getDetails() {
    this.manageDocs.getDocDetails(this.docID)
    .subscribe(
      (data:any) => { 
        this.docTitle = data.docTitle
        this.editDocData = { 'journey': data.journey.toLowerCase(), 'docTitle': this.docTitle}
      }
    )
  }

  getVersions() {
    this.manageVersion.getAllVersions(this.docID)
    .subscribe(
      (res: any) => {
        console.log(res)
        this.dataSource = res
      },
      err => console.log(err)
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
