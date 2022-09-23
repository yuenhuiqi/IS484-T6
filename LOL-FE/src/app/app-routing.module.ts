import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReaderHomeComponent } from './components/reader-home/reader-home.component';
import { UploaderHomeComponent } from './components/uploader-home/uploader-home.component';
import { UploadDocumentComponent } from './components/upload-document/upload-document.component';
import { LoginComponent } from './components/login/login.component';
import { UploadSuccessComponent } from './components/upload-success/upload-success.component';
import { ViewDocumentComponent } from './components/docviewer/doc-viewer.component';
import { EditUploadedDocumentComponent } from './components/edit-uploaded-document/edit-uploaded-document.component';
import { ViewResultsProductComponent } from './components/view-results-product/view-results-product.component';
import { ViewResultsProcessComponent } from './components/view-results-process/view-results-process.component';


const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'reader', component: ReaderHomeComponent },
  { path: 'uploader', component: UploaderHomeComponent },
  { path: 'uploader/upload', component: UploadDocumentComponent},
  { path: 'uploader/upload/success', component: UploadSuccessComponent },
  { path: 'viewdocument', component: ViewDocumentComponent},
  { path: 'uploader/editdocument/:id', component: EditUploadedDocumentComponent },
  { path: 'viewresultsproduct', component: ViewResultsProductComponent },
  { path: 'viewresultsprocess', component: ViewResultsProcessComponent }


]

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
