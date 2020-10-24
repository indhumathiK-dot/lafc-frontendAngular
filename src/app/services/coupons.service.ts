import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CouponsService {
  private baseUrl = environment.base_url;
  constructor(private http: HttpClient) { }
  setCoupon(couponcode): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/coupon', couponcode, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(tap((r: any) => r as any), catchError(this.handleErrorObservable));
  }
  removeCoupon(): Observable<any> {
    return this.http.delete(this.baseUrl + '/coupon', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(tap((r: any) => r as any));
  }
  private handleErrorObservable(error: Response | any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      //client side error
      errorMessage = `Error: ${error.error.message}`
    } else {
      // server side error
      errorMessage = `Error code: ${error.status}\nMessage: ${error.message}`;
      //this.showErrorMessage = error.error.error[0];
    }
    return throwError(error.error);
  }

}
