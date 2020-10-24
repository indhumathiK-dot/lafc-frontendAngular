import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country, Zone } from '../models/country.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private baseUrl: any = environment.base_url;
  constructor(private http: HttpClient) { }
  
  getcountryNames(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/countries', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(map((r: any) => r.data as any));
  }

  getStatesName(country_id): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/countries' + `/${country_id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(map((r: any) => r.data as any));
  }
}
