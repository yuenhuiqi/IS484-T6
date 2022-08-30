import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReaderHomeComponent } from './reader-home/reader-home.component';
import { UploaderHomeComponent } from './uploader-home/uploader-home.component';


const routes: Routes = [
  { path: '', component: ReaderHomeComponent },
  { path: 'uploader', component: UploaderHomeComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
