import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeliveryAddress } from '../models/delivery.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShippingAddressService {
  private baseUrl = environment.base_url;
  constructor(private http: HttpClient) { }

  addAddress(addressObject): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/shippingaddress', addressObject, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getAddress(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/shippingaddress', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(map( (r: any) => r as any));
  }

  getExisitngShippingAddress(addrId): Observable<any> {
    return this.http.post<any>(this.baseUrl + `/shippingaddress/existing`, {address_id: Number(addrId)}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

}
