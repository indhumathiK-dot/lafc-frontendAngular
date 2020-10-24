import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private baseUrl = environment.base_url;
  constructor(private http: HttpClient) { }

  getAllBlogs(): Observable<any> {
    return this.http.get(this.baseUrl + '/blog', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getBlogByArticleId(id): Observable<any> {
    return this.http.get(this.baseUrl + '/getArticleBasedOnId' + `/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getRecentArticle(): Observable<any> {
    return this.http.get(this.baseUrl + '/getRecentArticle', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
