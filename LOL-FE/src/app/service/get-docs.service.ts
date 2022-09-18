import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetDocsService {

  constructor(private http: HttpClient) { }

  getDocDetails() {
    return this.http.get(`http://localhost:2222/getDocDetails`)
  }
}
