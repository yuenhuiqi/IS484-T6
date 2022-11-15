import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = environment.backend_path + "/login"
  constructor(private http: HttpClient) { }

  loginUser(user : any) {
    return this.http.post(this.loginUrl, user)
  }

  getUser(token : any) {
    return this.http.get(`${this.loginUrl}/${token}`, token)
  }
}
