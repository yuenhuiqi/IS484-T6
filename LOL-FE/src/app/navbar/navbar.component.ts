import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'

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
  
  token = localStorage.getItem('token')
  userName: String = "";
  time: Date = new Date();
  greetings: String = "";

  constructor(
    private user: UserService,
    ) { }

  ngOnInit() {
    this.getUserName()

    var currentTime = parseInt(this.time.toLocaleString('en-US', { hour: 'numeric', hour12: false }))
    this.greetings = currentTime >= 0 && currentTime <= 12 ? "Good Morning" :
                      currentTime >= 12 && currentTime < 18 ? "Good Afternoon" :
                      "Good Evening"
  }

  getUserName() {
    this.user.getUserName(this.token)
      .subscribe(
        res => { 
          this.userName = (<any>res).userName
        }, 
        err => console.log(err)
      )
  }

  logout() {
    localStorage.setItem('token', "")
    location.assign('/')
  }
}
