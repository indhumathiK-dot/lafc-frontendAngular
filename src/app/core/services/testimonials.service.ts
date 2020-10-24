import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestimonialsService {
  private url = environment.base_url;
  constructor(private http: HttpClient) { }
  getTestimonials(): Observable<any> {    
    return this.http.get<any>(this.url + 'customertestimonials', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
