import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  title: string;
  fileName: string;
  fileType: string;
  journey: string;
  uploadDate: Date;
  uploaderName: string;
  uploadStatus: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {title: 'Lending Journey User Guide', fileName: "lending_journey.pdf", fileType: 'Pdf', journey: "lending", uploadDate: new Date("08/08/2022"), uploaderName: "CY", uploadStatus: 'uploaded'},
  {title: 'Lending Journey User Guide', fileName: "lending_journey.pdf", fileType: 'Pdf', journey: "lending", uploadDate: new Date("08/08/2022"), uploaderName: "CY", uploadStatus: 'uploaded'},
  {title: 'Lending Journey User Guide', fileName: "lending_journey.pdf", fileType: 'Pdf', journey: "lending", uploadDate: new Date("08/08/2022"), uploaderName: "CY", uploadStatus: 'uploaded'},
];

@Component({
  selector: 'app-uploader-home',
  templateUrl: './uploader-home.component.html',
  styleUrls: ['./uploader-home.component.css']
})
export class UploaderHomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  displayedColumns: string[] = ['title', 'fileName', 'fileType', 'journey', 'uploadDate', 'uploaderName', 'uploadStatus', 'edit', 'delete'];
  dataSource = ELEMENT_DATA;

  // public fileList: any = [];

  // formData = new FormData();

  // getFormData() {
  //   this.fileList = []
  //   this.formData.forEach((value, key) => {
  //     console.log(key)
  //     console.log(value)
  //     // var n = value
  //     var file_dict = {
  //       'key': key,
  //       'value': value
  //     }
  //     this.fileList.push(file_dict)
  //   })
  //   console.log(this.fileList)
  // }

  // editFile(key:any) {
  //   console.log(key)
  // }

  // deleteFile(key:any) {
  //   console.log(key)

  //   this.formData.delete(key)
  //   this.getFormData()
  // }

  // reset() {
  //   // Clear FormData Obj
  //   this.formData.forEach((value, key) => {
  //     this.formData.delete(key)
  //   })
  //   this.fileList = []
  // }


}
