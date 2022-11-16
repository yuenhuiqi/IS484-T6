import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManageFeedbackServiceService {

  private baseurl = "http://localhost:2222/"

  constructor(private http: HttpClient) { }

  updateFeedback(searchID:String, docID:String, score:any) {
    return this.http.post(`${this.baseurl}feedback/${searchID}/${docID}/${score}`, {})
  }

  addFeedbackCount(searchID:String, docID:String) {
    return this.http.post(`${this.baseurl}addFeedback/${searchID}/${docID}`, {})
  }

  getFeedback(searchID:String, docID:String) {
    return this.http.post(`${this.baseurl}getFeedback/${docID}/${searchID}`, {})
  }
}
