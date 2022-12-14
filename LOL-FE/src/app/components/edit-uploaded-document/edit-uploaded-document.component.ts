import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar';

import { ManageDocsService } from '../../service/manage-docs.service';
import { ManageVersioningService } from '../../service/manage-versioning.service';
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-edit-uploaded-document',
  templateUrl: './edit-uploaded-document.component.html',
  styleUrls: ['./edit-uploaded-document.component.css']
})
export class EditUploadedDocumentComponent implements OnInit {

  constructor(
    private user: AuthService,
    private manageVersion: ManageVersioningService, 
    private manageDocs: ManageDocsService, 
    private route: ActivatedRoute,
    private snackbar: MatSnackBar
  ) { }

  @ViewChild('fileInput')
  fileInput :any;
  file: File | null = null;
  public fileList: any = {};
  sub: any;
  docID: any;
  docTitle: any;
  editDocData: any;

  token = localStorage.getItem('token');
  userID: String = "";

  displayedColumns: string[] = ['docName', 'lastUpdated', 'uploaderName']
  dataSource = [];

  ngOnInit(): void {
    this.getUserID()
    this.sub = this.route.params.subscribe(params => {
      this.docID = params['id'];
    });

    this.getDetails()
    this.getVersions()
  }

  getDetails() {
    this.manageDocs.getDocDetails(this.docID)
    .subscribe(
      (data:any) => { 
        this.docTitle = data.docTitle
        this.editDocData = { 'journey': data.journey, 'docTitle': this.docTitle, 'docName': data.docName}

      }
    )
  }

  getVersions() {
    this.manageVersion.getAllVersions(this.docID)
    .subscribe(
      (res: any) => {
        this.dataSource = res
      },
      err => console.log(err)
    )
  }

  viewDocument(): void {
    location.assign(`/viewdocument/${this.docID}`)
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }
  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];

    var file_dict = {
      'file': '',
      'title': this.editDocData.docTitle,
      'journey': this.editDocData.journey,
      'userID': this.userID
    }
    this.fileList[`${this.file?.name}`] = file_dict

    this.convertfile(this.file, this.file?.name.toString())
  }

  editUploadedDoc(): void {
    this.manageDocs.updateDoc(this.docID, this.editDocData.docTitle, this.editDocData.journey)
      .subscribe((data:any) => {
        if (data.code == 200) {
          this.snackbar.open(data.message, '', {
            duration: 1500,
            verticalPosition: "top"
          })
            .afterDismissed().subscribe(() => location.assign('/uploader'))
        }
      })
  }

  getUserID() {
    this.user.getUser(this.token)
      .subscribe(
        (res: any) => {
          this.userID = res.userID
        },
        err => console.log(err)
      )
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

  async convertfile(file: any, filename: any) {
    try {
      const data = await this.getBase64(file);
      this.fileList[filename].file = data
    } catch (error) {
      console.log(error)
    }
  }

  uploadDoc() {
    this.manageDocs.uploadDocs(this.fileList)
      .subscribe({
        next: (res) => console.log(res),
        error: (err) => {
          // Upload Success
          if (err.error.text == 'All documents uploaded!') {
            // REDIRECT to success page
            this.snackbar.open("Document have been uploaded successfully!", '', {
                duration: 1500,
                verticalPosition: "top"
              })
                .afterDismissed().subscribe(() => location.assign('/uploader'))
          }
          else {
            // ADD ERROR MESSAGE/DIALOG
            this.snackbar.open(err.statusText, 'Close', {
              duration: 2000,
              verticalPosition: "top"
            })
          }
        },
      });
  }
}
