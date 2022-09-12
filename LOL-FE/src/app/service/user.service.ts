import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUser(token : any) {
    return this.http.get(`http://localhost:2222/login/${token}`, token)
  }
}
