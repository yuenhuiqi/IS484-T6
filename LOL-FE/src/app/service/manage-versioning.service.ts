import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageVersioningService {

  private baseurl = environment.backend_path
  constructor(private http: HttpClient) { }

  getAllVersions(docID:string) {
    return this.http.get(`${this.baseurl}/getAllVersions/` + docID)
  }
}
