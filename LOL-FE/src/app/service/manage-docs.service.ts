import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManageDocsService {

  constructor(private http: HttpClient) { }

  getAllDocDetails() {
    return this.http.get(`http://localhost:2222/getAllDocDetails`)
  }

  getDocDetails(docID:string) {
    return this.http.get(`http://localhost:2222/getDocDetails/` + docID)
  }

  updateDoc(docID:string, docTitle:string, journey:string) {
    return this.http.post(`http://localhost:2222/updateDoc/${docID}/${docTitle}/${journey}`, {})
  }

  deleteDoc(docName:string) {
    return this.http.post(`http://localhost:2222/deleteDoc`, docName)
  }
}
