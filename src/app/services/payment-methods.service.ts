import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})

export class PaymentMethodsService {
  private baseUrl = environment.base_url;
  constructor(private http: HttpClient) { }
  getPaymentMethods(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/paymentmethods', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(map((r: any) => r.data as any));
  }
  // Post selected payment method
  addPaymentMethod(paymentObj, comment): Observable<any> {
    this.getPaymentMethods();
    return this.http.post<any>(this.baseUrl + '/paymentmethods', { payment_method: paymentObj, agree: "1", comment: comment }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
  }).pipe(map((r: any) => r as any));
  }
}
