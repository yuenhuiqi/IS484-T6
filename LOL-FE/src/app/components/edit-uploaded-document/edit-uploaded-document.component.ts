import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-uploaded-document',
  templateUrl: './edit-uploaded-document.component.html',
  styleUrls: ['./edit-uploaded-document.component.css']
})
export class EditUploadedDocumentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  triggerSelectFile(fileInput: HTMLInputElement) {
    fileInput.click()
  }


}
