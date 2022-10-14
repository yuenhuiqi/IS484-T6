import { Component, OnInit } from '@angular/core';
import { ManageDocsService } from '../../service/manage-docs.service';
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-uploader-home',
  templateUrl: './uploader-home.component.html',
  styleUrls: ['./uploader-home.component.css']
})
export class UploaderHomeComponent implements OnInit {

  constructor(
    private manageDocs: ManageDocsService,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getAllDocDetails()
  }

  docDetails: any = {}

  displayedColumns: string[] = ['docTitle', 'docName', 'docType', 'journey', 'lastUpdated', 'uploaderName', 'upload_status', 'edit', 'delete']
  dataSource = [];

  getAllDocDetails() {
    this.manageDocs.getAllDocDetails()
      .subscribe(
        (res: any) => {
          console.log(res)
          this.docDetails = res
          this.dataSource = this.docDetails
        },
        err => console.log(err)
      )
  }

  editUploadedDoc(docID: any) {
    this.router.navigate(['/uploader/editdocument/' + docID]);
  }

  viewDocument(docID: any): void {
    window.open(`/uploader/viewdocument/${docID}`)
    // location.assign(`/viewdocument/${docID}`)
  }

  deleteDoc(docName: any) {
    console.log(docName)
    docName = { "docName": docName }
    this.manageDocs.deleteDoc(docName)
      .subscribe({
        next: (res) => console.log(res),
        error: (err) => {
          // Upload Success
          if (err.error.text == 'Document deleted!') {
            // RELOAD upon successful deletion
            console.log(err.error.text)
            this.snackbar.open(err.error.text, '', {
              duration: 6000,
              verticalPosition: "top"
            })
              .afterDismissed().subscribe(() => location.reload())
          }
          else {
            // ADD ERROR MESSAGE/DIALOG
            console.log(err.error.text)
            this.snackbar.open(err.error.text, 'Close')
          }
        },
      });
  }

}
