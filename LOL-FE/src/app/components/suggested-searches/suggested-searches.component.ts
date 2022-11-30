import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-suggested-searches',
  templateUrl: './suggested-searches.component.html',
  styleUrls: ['./suggested-searches.component.css']
})
export class SuggestedSearchesComponent implements OnInit {

  suggestedSearches: any;
  message: String;

  constructor(public dialogRef: MatDialogRef<SuggestedSearchesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.suggestedSearches = data.suggestedSearches;
      this.message = data.message;
     }
  ngOnInit(): void {
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}
export class DialogData {
  constructor(public suggestedSearches: any, public message: string) {
  }
}






