import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManageSuggestedAcronymService {

  private baseurl = "http://localhost:2222/"

  constructor(private http: HttpClient) {
  }

  getAllAcronyms() {
    return this.http.get(`${this.baseurl}getAllAcronyms`)
  }

}
