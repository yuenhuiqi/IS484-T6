import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReaderHomeComponent } from './reader-home/reader-home.component';
import { UploaderHomeComponent } from './uploader-home/uploader-home.component';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
import { LoginComponent } from './login/login.component';
import { EditDocumentDetailsComponent } from './edit-document-details/edit-document-details.component';


const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'reader', component: ReaderHomeComponent },
  { path: 'uploader', component: UploaderHomeComponent },
  { path: 'uploader/upload', component: UploadDocumentComponent},
  { path: 'uploader/upload/editDetails', component: EditDocumentDetailsComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
