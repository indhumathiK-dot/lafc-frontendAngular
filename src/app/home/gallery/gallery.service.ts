import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  private baseUrl = environment.base_url;
  constructor(private http: HttpClient) { }

  getGalleryImages(): Observable<any> {
    return this.http.get(this.baseUrl + '/gallery', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
