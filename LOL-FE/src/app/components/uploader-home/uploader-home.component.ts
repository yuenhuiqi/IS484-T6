import { Component, OnInit, ViewChild } from '@angular/core';
import { ManageDocsService } from '../../service/manage-docs.service';
import { Router } from '@angular/router'
import { FormControl } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogData, DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

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

  isLoading = true

  titleQuery = new FormControl();
  searchTitle:any = "-"
  docDetails: any = {}

  displayedColumns: string[] = ['docTitle', 'docName', 'docType', 'journey', 'lastUpdated', 'uploaderName', 'upload_status', 'edit', 'delete']
  dataSource = [];

  result: any;

  // MatPaginator Inputs
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 25, 50, 100];

  ngOnInit(): void {
    this.getAllDocDetails()
  }

  getAllDocDetails() {
    this.isLoading = true
    if (this.titleQuery.value == null || this.titleQuery.value.trim().length === 0) {
      this.searchTitle = "-"
    }
    // console.log(this.currentPage, this.pageSize)
    this.manageDocs.getAllDocDetails(this.searchTitle, this.pageSize, this.currentPage+1)
      .subscribe(
        (res: any) => {
          console.log(res)
          this.isLoading = false
          this.docDetails = res.details
          this.dataSource = this.docDetails

          this.totalRows = res.itemCount
        },
        err => {
          console.log(err.statusText)
          this.isLoading = false
        }
      )
  }

  searchDoc() {
    this.searchTitle = this.titleQuery.value.trim()
    this.currentPage = 0
    this.getAllDocDetails()
  }

  pageChanged(event: PageEvent) {
    console.log(event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAllDocDetails();
  }

  clearSearch() {
    this.titleQuery.reset()
    this.getAllDocDetails()
  }

  editUploadedDoc(docID: any) {
    this.router.navigate(['/uploader/editdocument/' + docID]);
  }

  viewDocument(docID: any): void {
    console.log(docID)
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
      this.isLoading = true
      this.manageDocs.deleteDoc(docName)
        .subscribe({
          next: (res) => console.log(res),
          error: (err) => {
            // DELETE Success
            if (err.error.text == 'Document deleted!') {
              // RELOAD upon successful deletion
              console.log(err.error.text)
              this.snackbar.open(err.error.text, 'x', {
                duration: 1000,
                verticalPosition: "top"
              })
                .afterDismissed().subscribe(() => location.reload())
            }
            else {
              // ADD ERROR snackbar message
              console.log(err.error.text)
              this.snackbar.open(err.error.text, 'Close')
              this.isLoading = false
            }
          },
        });

    });
  }

}
