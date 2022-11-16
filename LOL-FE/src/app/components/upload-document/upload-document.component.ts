import { Component, OnInit, Inject } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
// import { Data } from '@angular/router';
// import * as e from 'express';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditDocumentDetailsComponent } from '../edit-document-details/edit-document-details.component';
import { AuthService } from '../../service/auth.service';
import { ManageDocsService } from '../../service/manage-docs.service';

import { elementAt } from 'rxjs';


export interface DialogData {
  title: string;
  journey: string;
  isDocValid: boolean;
}

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css']
})

export class UploadDocumentComponent {
  progress = "20"
  constructor(
    private manageDocs: ManageDocsService,
    private user: AuthService,
    public http: HttpClient,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.getUserID()
  }

  isValid:any = false;
  isDocValid:any = false;
  public fileList: any = {};
  public errorList: any = {};
  objectKeys = Object.keys;
  token = localStorage.getItem('token');
  userID: String = "";
  snackbarOpen:any = true;

  public dropped(files: NgxFileDropEntry[]) {

    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          console.log(file);


          // Here you can access the real file
          var filename = droppedFile.relativePath
          // console.log(filename, file);
          // console.log(this.userID)

          var file_dict = {
            'file': '',
            'title': filename,
            'journey': '',
            'userID': this.userID
          }

          if (!(filename in this.fileList)) {
            this.fileList[filename] = file_dict
            this. errorList[filename] = this.isDocValid
            this.convertfile(file, filename)
          }
          else {
            console.log(filename + "is already added")
            this.snackbar.open(`${filename} is already selected`, 'Close', {
              duration: 5000,
              verticalPosition: "top",
              panelClass: ["errorAlert"]
            })
          }

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  editFile(key: any) {
    console.log(key)
    this.openDialog(key)
  }

  deleteFile(key: any) {
    console.log(key)
    delete this.fileList[key]
    delete this.errorList[key]
  }

  getUserID() {
    this.user.getUser(this.token)
      .subscribe(
        (res: any) => {
          // console.log(res)
          this.userID = res.userID
          // console.log(this.userID)
        },
        err => console.log(err)
      )
  }

  uploadfile(file: any) {
    // this.http
    //   .post('http://localhost:2222/upload', file)
    this.manageDocs.uploadDocs(file)
      .subscribe({
        next: (res) => console.log(res),
        error: (err) => {
          // console.log(err.error.text)

          // Upload Success
          if (err.error.text == 'All documents uploaded!') {
            // RESET fileList
            this.reset()
            // REDIRECT to success page
            console.log(err.error.text)
            this.snackbarOpen = true
            this.snackbar.open("Documents have been uploaded successfully!", 'Close', {
              duration: 6000,
              verticalPosition: "top",
              panelClass: ["successAlert"]   
            }).afterDismissed().subscribe(()=>{
              this.router.navigate(['/uploader']);
            });
          }
          else {
            // ADD ERROR MESSAGE/DIALOG
            console.log(err.error.text)
            this.snackbarOpen = true
            this.snackbar.open(err.error.text, 'Close', {
              duration: 2000,
              verticalPosition: "top",
              panelClass: ["errorAlert"]
            })
          }
        },
      });
  }

  checkValidity() {
    for (let key in this.errorList) {
      if (!this.errorList[key]){
        return true
      }
    }
    return false
  }

  submitForm() {
    // Check fileList records
    console.log(this.fileList)
    this.snackbarOpen = false

    // POST FormData to Backend
    this.uploadfile(this.fileList)
  }

  reset() {
    // Clear FormData Obj
    this.fileList = {}
  }

  openDialog(key: any): void {
    const dialogRef = this.dialog.open(EditDocumentDetailsComponent, {
      width: '1000px',
      data: { title: this.fileList[key].title, journey: this.fileList[key].journey, isDocValid: this.errorList[key] },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      console.log('The dialog was closed');

      this.fileList[key].title = result.title.trim()
      this.fileList[key].journey = result.journey
      this.errorList[key] = result.isDocValid
    });
  }

  getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(reader.result)
      };
      reader.onerror = () => {
        reject(new Error('Unable to read..'));
      };
      reader.readAsDataURL(file);
    });

  }

  async convertfile(file: any, filename: string) {
    try {
      const data = await this.getBase64(file);

      // console.log(file)
      this.fileList[filename].file = data

      // console.log(this.fileList)
    } catch (error) {
      console.log(error)
    }
  }

}



