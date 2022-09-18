import { Component, OnInit } from '@angular/core';
import { ManageDocsService } from '../../service/manage-docs.service';

@Component({
  selector: 'app-uploader-home',
  templateUrl: './uploader-home.component.html',
  styleUrls: ['./uploader-home.component.css']
})
export class UploaderHomeComponent implements OnInit {

  constructor(private manageDocs: ManageDocsService) { }

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
          // console.log(this.docDetails)
          this.dataSource = this.docDetails
        },
        err => console.log(err)
      )
  }

  // editFile(key:any) {
  //   console.log(key)
  // }

  deleteDoc(docID: any) {
    console.log(docID)
    this.manageDocs.deleteDoc(docID)
      .subscribe({
        next: (res) => console.log(res),
        error: (err) => {
          // console.log(err.error.text)

          // Upload Success
          if (err.error.text == 'Document deleted!') {
            console.log('Document deleted!')

            // ADD REDIRECT LINK TO SUCCESS
            console.log(err.error.text)
          }
          else {
            // ADD ERROR MESSAGE/DIALOG
            console.log(err.error.text)
          }
        },
      });
  }

}
