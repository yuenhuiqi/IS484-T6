import { Component, OnInit } from '@angular/core';
import {MatTable} from '@angular/material/table';
import { GetDocsService } from '../../service/get-docs.service';

export interface PeriodicElement {
  docTitle: string;
  docName: string;
  docType: string;
  journey: string;
  lastUpdated: Date;
  uploaderName: string;
  upload_status: string;
}

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
  token = localStorage.getItem('token');
  userName: String = "";
  detailsList:any = []

  displayedColumns: string[] = ['docTitle', 'docName', 'docType', 'journey', 'lastUpdated', 'uploaderName', 'upload_status', 'edit', 'delete']
  dataSource = [];

  getDocDetails() {
    this.GetDocs.getDocDetails()
      .subscribe(
        (res: any) => {
          console.log(res)
          this.docDetails = res
          console.log(this.docDetails)
          this.displayDetails()
        },
        err => console.log(err)
      )
  }

  displayDetails() {
    this.docDetails.forEach((docDetail: any) => {
      // console.log(docDetail)
      var doc_dict:any = {}
      for (let col of this.displayedColumns.slice(0, -2)) {
        console.log(col)
        doc_dict[col] = docDetail[col]
        console.log(doc_dict)
      }
      console.log(doc_dict)
      this.detailsList.push(doc_dict)
    })

    const ELEMENT_DATA = this.detailsList
    this.dataSource = ELEMENT_DATA
  }


  // editFile(key:any) {
  //   console.log(key)
  // }

  // deleteFile(key:any) {
  //   console.log(key)

  //   this.formData.delete(key)
  //   this.getFormData()
  // }

}
