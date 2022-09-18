import { Component, OnInit } from '@angular/core';
import { GetDocsService } from '../../service/get-docs.service';

@Component({
  selector: 'app-uploader-home',
  templateUrl: './uploader-home.component.html',
  styleUrls: ['./uploader-home.component.css']
})
export class UploaderHomeComponent implements OnInit {

  constructor(private GetDocs: GetDocsService) { }

  ngOnInit(): void {
    this.getDocDetails()
  }

  docDetails: any = {}

  displayedColumns: string[] = ['docTitle', 'docName', 'docType', 'journey', 'lastUpdated', 'uploaderName', 'upload_status', 'edit', 'delete']
  dataSource = [];

  getDocDetails() {
    this.GetDocs.getDocDetails()
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

  deleteDoc(key:any) {
    console.log(key)

  }

}
