import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManageVersioningService {

  private baseurl = "http://localhost:2222/"
  constructor(private http: HttpClient) { }

  getAllVersions(docID:string) {
    return this.http.get(`${this.baseurl}getAllVersions/` + docID)
  }
}
