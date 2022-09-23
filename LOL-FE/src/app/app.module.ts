import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ReaderHomeComponent } from './components/reader-home/reader-home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UploaderHomeComponent } from './components/uploader-home/uploader-home.component';
import { UploadDocumentComponent } from './components/upload-document/upload-document.component';

import { NgxFileDropModule } from 'ngx-file-drop';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { EditDocumentDetailsComponent } from './components/edit-document-details/edit-document-details.component';
import { UploadSuccessComponent } from './components/upload-success/upload-success.component';
import { ViewDocumentComponent } from './components/docviewer/doc-viewer.component';

import { MatDialogModule } from '@angular/material/dialog';
import { EditUploadedDocumentComponent } from './components/edit-uploaded-document/edit-uploaded-document.component';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {MatExpansionModule} from '@angular/material/expansion';
import { ViewResultsProductComponent } from './components/view-results-product/view-results-product.component';
import { ViewResultsProcessComponent } from './components/view-results-process/view-results-process.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ReaderHomeComponent,
    NavbarComponent,
    UploaderHomeComponent,
    UploadDocumentComponent,
    EditDocumentDetailsComponent,
    UploadSuccessComponent, 
    ViewDocumentComponent, 
    EditUploadedDocumentComponent, 
    ViewResultsProductComponent, 
    ViewResultsProcessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatToolbarModule, 
    MatIconModule,
    MatInputModule,
    MatGridListModule,
    MatButtonModule,
    MatTableModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxFileDropModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    CdkAccordionModule, 
    MatExpansionModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }