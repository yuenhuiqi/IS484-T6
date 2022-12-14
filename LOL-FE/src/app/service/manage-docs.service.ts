import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageDocsService {

  private baseurl = environment.backend_path
  constructor(private http: HttpClient) { }

  getAllDocDetails(titleQuery:String, pageSize:Number, pageNo:Number) {
    return this.http.get(`${this.baseurl}/getAllDocDetails/${titleQuery}/${pageSize}/${pageNo}`)
  }

  getDocDetails(docID:string) {
    return this.http.get(`${this.baseurl}/getDocDetails/${docID}`)
  }

  uploadDocs(file:any) {
    return this.http.post(`${this.baseurl}/upload`, file)
  }

  updateDoc(docID:string, docTitle:string, journey:string) {
    return this.http.post(`${this.baseurl}/updateDoc/${docID}/${docTitle}/${journey}`, {})
  }

  deleteDoc(docName:string) {
    return this.http.post(`${this.baseurl}/deleteDoc`, docName)
  }
}
