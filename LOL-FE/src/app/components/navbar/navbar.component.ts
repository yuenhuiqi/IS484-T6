import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service'

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
  
  token = localStorage.getItem('token');
  userName: String = "";
  time: Date = new Date();
  greetings: String = "";
  userRole: String = "";
  

  constructor(
    private user: AuthService,
    ) { }

  ngOnInit() {
    this.getUserName()
    var currentTime = parseInt(this.time.toLocaleString('en-US', { hour: 'numeric', hour12: false }))
    this.greetings = currentTime >= 0 && currentTime <= 12 ? "Good Morning" :
                      currentTime >= 12 && currentTime < 18 ? "Good Afternoon" :
                      "Good Evening"
  }

  getUserName() {
    this.user.getUser(this.token)
      .subscribe(
        res => { 
          this.userName = (<any>res).userName
          this.userRole = (<any>res).role
        }, 
        err => console.log(err)
      )
  }

  logout() {
    localStorage.setItem('token', "")
    location.assign('/')
  }
}
