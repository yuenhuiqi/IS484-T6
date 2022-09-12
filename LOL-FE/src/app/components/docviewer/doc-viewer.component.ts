import { Component, OnInit } from '@angular/core';  

  
@Component({  
  selector: 'app-docviewer',  
  templateUrl: './doc-viewer.component.html',  
  styleUrls: ['./doc-viewer.component.css']  
})  
export class ViewDocumentComponent implements OnInit {  

  constructor() { }  
  
  ngOnInit(): void {  
  }  

  showModal = -1; 

  show(index: number){
    this.showModal= index;
  }

  close(){
    this.showModal = -1; 
  }

}  

