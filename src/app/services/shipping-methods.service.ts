import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ShippingMethodModel } from '../models/shippingMethods.model';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShippingMethodsService {
  private baseUrl = environment.base_url;
  constructor(private http: HttpClient) { }
  // Load shipping methods available
  getShippingMethods(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/shippingmethods' , {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(map((r: any) => r as any));
  }
  // To post selected shipping method from user
  addShippingMethod(shippingMethodObject): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/shippingmethods' , shippingMethodObject, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(tap((r: any) => r), catchError(this.handleErrorObservable));
  }
  setShippingMethod(obj) {
    return this.getShippingMethods().pipe(switchMap(data => {
      return this.addShippingMethod(obj);
    }));
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
