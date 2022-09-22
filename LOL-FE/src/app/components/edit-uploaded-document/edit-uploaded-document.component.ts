import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-edit-uploaded-document',
  templateUrl: './edit-uploaded-document.component.html',
  styleUrls: ['./edit-uploaded-document.component.css']
})
export class EditUploadedDocumentComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient, private snackbar: MatSnackBar) { }

  
  @ViewChild('fileInput')
  fileInput :any;
  sub: any;
  docID: any;
  file: File | null = null;
  documentDetails: any;
  editDocData: any;
  res: any;

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
  }

  viewDocument(): void {
    location.assign(`/viewdocument/${this.documentDetails.docID}`)
  }

  editUploadedDoc(): void {
    this.http.post<any>(`http://localhost:2222/updateDoc/${this.docID}/${this.editDocData.docTitle}/${this.editDocData.journey}`, {} )
    .subscribe(data => {
      if (data.code == 200) {
        this.snackbar.open(data.message, 'Close')
          .afterDismissed().subscribe(()=>location.assign('/uploader')) 
      }
    })
  }

  ngOnInit(): void {

    this.sub = this.route.params.subscribe(params => {
      this.docID = params['id'];
    });
    
    this.http.get<any>(`http://localhost:2222/getDocDetails/` + this.docID)
      .subscribe(
        data => { this.editDocData = {'journey': data.journey.toLowerCase(), 'docTitle': data.docTitle}, this.documentDetails = data}
      )
  }
}
