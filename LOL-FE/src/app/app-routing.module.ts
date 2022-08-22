import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReaderHomeComponent } from './reader-home/reader-home.component';
import { NavbarComponent } from './navbar/navbar.component';


const routes: Routes = [
  {path: '', component: ReaderHomeComponent },
  { path: 'test', component: NavbarComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
