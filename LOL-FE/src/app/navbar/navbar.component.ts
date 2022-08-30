import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

interface User {
  type: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  userControl = new FormControl<User | null>(null);
  users: User[] = [
    {type: 'Reader', path: ''},
    {type: 'Uploader', path: '/uploader'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
