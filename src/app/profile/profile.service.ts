import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = environment.base_url;
  constructor(private http: HttpClient) { }
  getProfile(): Observable<any> {
    return this.http.get(this.baseUrl + '/account', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  updateProfile(profileObject): Observable<any> {
    return this.http.put(this.baseUrl + '/account', profileObject, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  getNotifications(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/notification', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
