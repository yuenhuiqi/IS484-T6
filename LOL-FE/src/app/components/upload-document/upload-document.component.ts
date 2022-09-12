import { Component, OnInit, Inject } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
// import { Data } from '@angular/router';
// import * as e from 'express';
import { MatDialog } from '@angular/material/dialog';
import { EditDocumentDetailsComponent } from '../edit-document-details/edit-document-details.component';

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

  public fileList: any = [];
  // convertFile: any;
  formData = new FormData();


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


          this.formData.append(filename, file)

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }

    this.getFormData()
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
  getFormData() {
    this.fileList = []
    this.formData.forEach((value, key) => {
      console.log(key)
      console.log(value)
      // var n = value
      var file_dict = {
        'key': key,
        'value': value
      }
      this.fileList.push(file_dict)
    })
    console.log(this.fileList)
  }

  editFile(key:any) {
    console.log(key)
  }

  deleteFile(key:any) {
    console.log(key)

    this.formData.delete(key)
    this.getFormData()
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
            this.reset()
            // console.log('All files are uploaded!')
          }
        },
      });
  }

  submitForm() {
    // Check FormData records
    this.formData.forEach((value, key) => {
      console.log(key)
      console.log(value)
    })

    // POST FormData to Backend
    this.uploadfile(this.formData)
  }

  reset() {
    // Clear FormData Obj
    this.formData.forEach((value, key) => {
      this.formData.delete(key)
    })
    this.fileList = []
  }

  title: string;
  journey: string;

  openDialog(): void {
    const dialogRef = this.dialog.open(EditDocumentDetailsComponent, {
      width: '1000px',
      data: {title: this.title, journey: this.journey},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.title = result;
    });
  }


}



