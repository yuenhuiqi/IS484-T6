import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  title: string;
  journey: string;
  isDocValid: boolean;
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

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isDocValid = !isWhitespace;
    return isDocValid ? null : { 'whitespace': true };
}

  editDocDetails = new FormGroup({
    title: new FormControl(this.data.title, [Validators.required, this.noWhitespaceValidator]),
    journey: new FormControl(this.data.journey, Validators.required) 
  });
  

  onNoClick(): void {
    // console.log(this.editDocDetails.valid)
    this.dialogRef.close();
  }

  save() {
    // console.log(this.editDocDetails.valid)
    this.data.isDocValid = this.editDocDetails.valid
    this.dialogRef.close(this.data);
  }

}



