import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManageDocsService {

  private baseurl = "http://localhost:2222/"
  constructor(private http: HttpClient) { }

  getAllDocDetails(titleQuery:String) {
    return this.http.get(`${this.baseurl}getAllDocDetails/` + titleQuery)
  }

  getDocDetails(docID:string) {
    return this.http.get(`${this.baseurl}getDocDetails/` + docID)
  }

  updateDoc(docID:string, docTitle:string, journey:string) {
    return this.http.post(`${this.baseurl}updateDoc/${docID}/${docTitle}/${journey}`, {})
  }

  deleteDoc(docName:string) {
    return this.http.post(`${this.baseurl}deleteDoc`, docName)
  }
}
