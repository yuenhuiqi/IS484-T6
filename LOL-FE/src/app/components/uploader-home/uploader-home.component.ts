import { Component, OnInit } from '@angular/core';
import { ManageDocsService } from '../../service/manage-docs.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-uploader-home',
  templateUrl: './uploader-home.component.html',
  styleUrls: ['./uploader-home.component.css']
})
export class UploaderHomeComponent implements OnInit {

  constructor(
    private manageDocs: ManageDocsService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.getDocDetails()
  }

  docDetails: any = {}

  displayedColumns: string[] = ['docTitle', 'docName', 'docType', 'journey', 'lastUpdated', 'uploaderName', 'upload_status', 'edit', 'delete']
  dataSource = [];

  getDocDetails() {
    this.manageDocs.getDocDetails()
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

  deleteDoc(docName: any) {
    console.log(docName)
    docName = {"docName":docName}
    this.manageDocs.deleteDoc(docName)
      .subscribe({
        next: (res) => console.log(res),
        error: (err) => {
          // console.log(err.error.text)

          // Upload Success
          if (err.error.text == 'Document deleted!') {
            // RELOAD upon successful deletion
            console.log(err.error.text)
            location.reload()
          }
          else {
            // ADD ERROR MESSAGE/DIALOG
            console.log(err.error.text)
          }
        },
      });
  }

}
