import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';

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
  loginForm: FormGroup;
  hide = true;
  users: User[] = [
    {value: 'lolup1', viewValue: 'Uploader 1'},
    {value: 'lolup2', viewValue: 'Uploader 2'},
    {value: 'lolre', viewValue: 'Reader'},
  ];


  constructor(
    private formBuilder: FormBuilder
  ) { 
  }

  ngOnInit(): void {

        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

  }

  onSubmit() {
    
  }


}