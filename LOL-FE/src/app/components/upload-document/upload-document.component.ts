import { Component, OnInit, Inject } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
// import { Data } from '@angular/router';
// import * as e from 'express';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditDocumentDetailsComponent } from '../edit-document-details/edit-document-details.component';
import { AuthService } from '../../service/auth.service';

import { elementAt } from 'rxjs';


export interface DialogData {
  title: string;
  journey: string;
}

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css']
})

export class UploadDocumentComponent {

  constructor(
    private user: AuthService,
    public http: HttpClient,
    public dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }


  ngOnInit(): void {
    this.getUserID()
  }

  public fileList: any = {};
  token = localStorage.getItem('token');
  userID: String = "";


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
            this.convertfile(file, filename)
          }
          else {
            console.log(filename + "is already added")
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
    this.http
      .post('http://localhost:2222/upload', file)
      .subscribe({
        next: (res) => console.log(res),
        error: (err) => {
          // console.log(err.error.text)

          // Upload Success
          if (err.error.text == 'All documents uploaded!') {

            console.log('All documents are uploaded!')
            // RESET fileList
            this.reset()
            // REDIRECT to success page
            console.log(err.error.text)
            this.snackbar.open("Documents have been uploaded successfully!", 'Close', {
              duration: 6000,
              verticalPosition: "top"
            })
            .afterDismissed().subscribe(() => location.assign('/uploader'))
            // location.assign('/uploader/upload/success')
          }
          else {
            // ADD ERROR MESSAGE/DIALOG
            console.log(err.error.text)
            this.snackbar.open(err.error.text, 'Close', {
              duration: 2000,
              verticalPosition: "top"
            })
          }
        },
      });
  }

  submitForm() {
    // Check fileList records
    console.log(this.fileList)

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
      data: { title: this.fileList[key].title, journey: this.fileList[key].journey },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      console.log('The dialog was closed');

      this.fileList[key].title = result.title
      this.fileList[key].journey = result.journey
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



