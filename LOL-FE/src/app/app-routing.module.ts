import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReaderHomeComponent } from './components/reader-home/reader-home.component';
import { UploaderHomeComponent } from './components/uploader-home/uploader-home.component';
import { UploadDocumentComponent } from './components/upload-document/upload-document.component';
import { LoginComponent } from './components/login/login.component';
import { ViewDocumentComponent } from './components/docviewer/doc-viewer.component';
import { EditUploadedDocumentComponent } from './components/edit-uploaded-document/edit-uploaded-document.component';
import { ViewResultsProcessComponent } from './components/view-results-process/view-results-process.component';


const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'reader', component: ReaderHomeComponent },
  { path: 'uploader', component: UploaderHomeComponent },
  { path: 'uploader/upload', component: UploadDocumentComponent},
  { path: 'uploader/viewdocument/:did/:qid/:type', component: ViewDocumentComponent},
  { path: 'viewdocument/:id', component: ViewDocumentComponent},
  { path: 'uploader/editdocument/:id', component: EditUploadedDocumentComponent },
  { path: 'viewresultsprocess/:query', component: ViewResultsProcessComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
