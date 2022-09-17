import { Component, OnInit, Inject } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
// import { Data } from '@angular/router';
// import * as e from 'express';
import { MatDialog } from '@angular/material/dialog';
import { EditDocumentDetailsComponent } from '../edit-document-details/edit-document-details.component';
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

  constructor(public http: HttpClient, public dialog: MatDialog) { }
  

  ngOnInit(): void {
  }

  public fileList: any = {};
  // convertFile: any;
  // formData = new FormData();


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
          // this.convertfile(file, filename)

          var file_dict = {
            'file': file,
            'title': '',
            'journey': ''
          }

          if (!(filename in this.fileList)) {
            this.fileList[filename] = file_dict
          }
          else {
            console.log(filename + "is already added")
          }

          // this.formData.append(filename, file)

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  editFile(key:any) {
    console.log(key)
    this.openDialog(key)
  }

  deleteFile(key:any) {
    console.log(key)
    delete this.fileList[key]
  }

  uploadfile(file: any) {
    this.http
      .post('http://localhost:2222/upload', file)
      .subscribe({
        next: (res) => console.log(res),
        error: (err) => {
          console.log(err.error.text)

          // Upload Success
          if (err.error.text == 'All files uploaded!') {
            
            console.log('All files are uploaded!')
            // Reset fileList
            this.reset()
            // ADD REDIRECT LINK TO SUCCESS

          }
          else {
            // ADD ERROR MESSAGE/DIALOG
            console.log(err.error.text)
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

  // title: string;
  // journey: string;

  openDialog(key:any): void {
    const dialogRef = this.dialog.open(EditDocumentDetailsComponent, {
      width: '1000px',
      data: {title: this.fileList[key].title, journey: this.fileList[key].journey},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      console.log('The dialog was closed');

      this.fileList[key]['title'] = result.title
      this.fileList[key].journey = result.journey
    });
  }


  
  // getBase64(file: any) {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       resolve(reader.result)
  //     };
  //     reader.onerror = () => {
  //       reject(new Error('Unable to read..'));
  //     };
  //     reader.readAsDataURL(file);
  //   });

  // }

  // async convertfile(file: any, filename: string) {
  //   try {
  //     const data = await this.getBase64(file);

  //     console.log(file)
  //     this.convertFile = {
  //       filename: filename,
  //       data: data
  //     }
  //     this.uploadfile(this.convertFile)

  //     console.log(this.convertFile)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

}



