import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ObserversModule } from '@angular/cdk/observers';

export interface Query {
  searchText: string;
}

@Injectable({
  providedIn: 'root'
})

export class ManageSearchQueryService {

  private baseurl = "http://localhost:2222/"

  constructor(private http: HttpClient) {
  }

  getSearchQuery(searchText: string): Observable<Query[]> {
    if (searchText.length == 0) {
      searchText = "-"
    }
    return this.http.get<Query[]>(`${this.baseurl}search/${searchText}`)
      .pipe(map(res => res));
  }

  addQueryCount(query: string) {
    return this.http.post(`${this.baseurl}addQueryCount/${query}`, {})
  }
}
