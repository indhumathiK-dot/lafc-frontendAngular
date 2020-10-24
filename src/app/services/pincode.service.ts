import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PincodeService {
  private baseUrl = environment.base_url;
  constructor(private http: HttpClient) { }

  checkPincodeDeliveries(pincode: number): Observable<any> {
    return this.http.get(this.baseUrl + `/checkpincodedeliveries/${pincode}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(map((res: any) => res.data as any));
  }
}
