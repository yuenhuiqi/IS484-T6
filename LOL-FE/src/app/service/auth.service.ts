import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = "http://54.254.54.186:2222/login"
  constructor(private http: HttpClient) { }

  loginUser(user : any) {
    return this.http.post(this.loginUrl, user)
  }

  getUser(token : any) {
    return this.http.get(`${this.loginUrl}/${token}`, token)
  }
}
