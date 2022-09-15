import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  title: string;
  journey: string;
}

@Component({
  selector: 'app-edit-document-details',
  templateUrl: './edit-document-details.component.html',
  styleUrls: ['./edit-document-details.component.css']
})
export class EditDocumentDetailsComponent {

  constructor(public dialogRef: MatDialogRef<EditDocumentDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}



