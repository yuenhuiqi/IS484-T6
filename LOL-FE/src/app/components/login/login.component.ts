import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

interface User {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})


export class LoginComponent implements OnInit {
  loginUserData = { userName: '', password: '' };
  hide = true;
  users: User[] = [
    {value: 'lolup1', viewValue: 'Uploader 1'},
    {value: 'lolup2', viewValue: 'Uploader 2'},
    {value: 'lolre', viewValue: 'Reader'},
  ];

  constructor(
    private auth: AuthService,
  ) { 
  }

  ngOnInit(): void {
  }


  loginUser() {
    this.auth.loginUser(this.loginUserData)
      .subscribe(
        res => {
          localStorage.setItem('token', (<any>res).token)
          if (this.loginUserData.userName == 'lolre') {
            location.assign('/reader')
          } else {
            location.assign('/uploader')
          }
        }, 
        err => console.log(err)
      )
  }


}