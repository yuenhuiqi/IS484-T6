import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
<<<<<<< Updated upstream
import { ReaderHomeComponent } from './components/reader-home/reader-home.component';
import { UploaderHomeComponent } from './components/uploader-home/uploader-home.component';
import { UploadDocumentComponent } from './components/upload-document/upload-document.component';
import { LoginComponent } from './components/login/login.component';
import { EditDocumentDetailsComponent } from './components/edit-document-details/edit-document-details.component';
import { UploadSuccessComponent } from './components/upload-success/upload-success.component';
=======
import { ReaderHomeComponent } from './reader-home/reader-home.component';
import { UploaderHomeComponent } from './uploader-home/uploader-home.component';
import { ViewDocumentComponent } from './docviewer/doc-viewer.component';
>>>>>>> Stashed changes


const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'reader', component: ReaderHomeComponent },
  { path: 'uploader', component: UploaderHomeComponent },
<<<<<<< Updated upstream
  { path: 'uploader/upload', component: UploadDocumentComponent},
  { path: 'uploader/upload/editDetails', component: EditDocumentDetailsComponent},
  { path: 'uploader/upload/success', component: UploadSuccessComponent }
=======
  { path: 'viewdocument', component: ViewDocumentComponent}
>>>>>>> Stashed changes
]

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
