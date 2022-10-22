import { Component, OnInit } from '@angular/core';
import { ManageDocsService } from '../../service/manage-docs.service';
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar';

import { DialogData, DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-uploader-home',
  templateUrl: './uploader-home.component.html',
  styleUrls: ['./uploader-home.component.css']
})
export class UploaderHomeComponent implements OnInit {

  constructor(
    private manageDocs: ManageDocsService,
    private router: Router,
    private snackbar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllDocDetails()
  }

  docDetails: any = {}

  displayedColumns: string[] = ['docTitle', 'docName', 'docType', 'journey', 'lastUpdated', 'uploaderName', 'upload_status', 'edit', 'delete']
  dataSource = [];

  result: any;

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
    // console.log(docName)
    const message = `Are you sure you want to delete the document and all it's versions?`;
    const dialogData = new DialogData(docName, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((dialogResult:any) => {
      this.result = dialogResult;
      console.log(this.result)

      docName = { "docName": docName }
      this.manageDocs.deleteDoc(docName)
        .subscribe({
          next: (res) => console.log(res),
          error: (err) => {
            // DELETE Success
            if (err.error.text == 'Document deleted!') {
              // RELOAD upon successful deletion
              console.log(err.error.text)
              this.snackbar.open(err.error.text, '', {
                duration: 1500,
                verticalPosition: "top"
              })
                .afterDismissed().subscribe(() => location.reload())
            }
            else {
              // ADD ERROR snackbar message
              console.log(err.error.text)
              this.snackbar.open(err.error.text, 'Close')
            }
          },
        });

    });
  }

}
