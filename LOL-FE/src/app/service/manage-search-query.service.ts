import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ObserversModule } from '@angular/cdk/observers';
import { environment } from 'src/environments/environment'; 

export interface Query {
  searchText: string;
}

@Injectable({
  providedIn: 'root'
})

export class ManageSearchQueryService {

  private baseurl = environment.backend_path

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
