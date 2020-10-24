import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentAddressService {
  private baseUrl = environment.base_url; 
  constructor(private http: HttpClient) { }

  addPaymentAddress(addressObj): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/paymentaddress', addressObj, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  getPaymentAddress(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/paymentaddress', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(map( (r: any) => r.data ));
  }
  getExistingPaymentAddress(existingAddress): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/paymentaddress/existing', {address_id: Number(existingAddress)}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
