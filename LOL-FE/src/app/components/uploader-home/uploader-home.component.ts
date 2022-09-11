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

  displayedColumns: string[] = ['title', 'fileName', 'fileType', 'journey', 'uploadDate', 'uploaderName', 'uploadStatus', 'actions'];
  dataSource = ELEMENT_DATA;


}