import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private baseUrl = environment.base_url;
  constructor(private http: HttpClient) { }
  getAddressById(address_id): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/account/address' + `/${address_id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(map((r: any) => r as any), catchError(this.handleErrorObservable));
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
