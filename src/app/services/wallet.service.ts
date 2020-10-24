import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private baseUrl = environment.base_url;
  constructor(private http: HttpClient) { }
  getWalletBalance(): Observable<any> {
    return this.http.get<any>(this.baseUrl + `/getWalletDetails`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(tap((r: any) => r as any));
  }
  applyWalletBalance(balance): Observable<any> {
    return this.http.post<any>(this.baseUrl + `/wallet`, { applied_wallet: balance }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(tap((r: any) => {
      r
    }));
  }
  removeAppliedWalletBalance(): Observable<any> {
    return this.http.delete<any>(this.baseUrl + `/wallet`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      tap((r: any) => r as any));
  }
}
