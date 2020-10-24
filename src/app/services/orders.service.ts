import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, switchMap, catchError, take } from 'rxjs/operators';
import { ShippingAddressService } from './shipping-address.service';
import { PaymentAddressService } from './payment-address.service';
import { ShippingMethodsService } from './shipping-methods.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
export class CreateOrder {
  constructor(public paymentAddId: string, public saddId: string, public shipMethId: string) {
  }
}
@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private baseUrl = environment.base_url;
  constructor(private http: HttpClient,
    private router: Router,
    public paymentAddressService: PaymentAddressService,
    public shippingAddressService: ShippingAddressService,
    public shippingMethodsService: ShippingMethodsService) { }

  // Before creating order
  addGstIn(gstObj): Observable<any> {
    return this.http.post<any>(this.baseUrl + `/addGSTINNO`, gstObj, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  // createOrderAS(ord: CreateOrder) {
  //   return this.paymentAddressService.getExistingPaymentAddress(ord.paymentAddId).pipe(
  //     switchMap((data) => {
  //       if (data.success === 1) {
  //         return this.shippingAddressService.getExisitngShippingAddress(ord.saddId).pipe(take(1));
  //       }
  //     },
  //     ),
  //     switchMap(data => {
  //       const obj = {
  //         "shipping_method": ord.shipMethId,
  //         "comment": 'Selected Shipping Method'
  //       };
  //       return this.shippingMethodsService.setShippingMethod(obj);
  //     })
  //   );
  // }

  createOrderAS(ord: CreateOrder) {
    this.paymentAddressService.getExistingPaymentAddress(ord.paymentAddId).pipe(take(1)).subscribe(data => {
      if (data.success === 1) {
        this.shippingAddressService.getExisitngShippingAddress(ord.saddId).pipe(take(1)).subscribe(data => {
          if (data.success === 1) {
            const obj = {
              "shipping_method": ord.shipMethId,
              "comment": 'Selected Shipping Method'
            };
            this.shippingMethodsService.setShippingMethod(obj).subscribe(data => {
              if (data.success === 1) {
                this.router.navigate(['/cart', 'checkout']);
              }
            });
          }
        });
      }
    });
  }

  // Get an overview of the order(it contains the order id)
  getOrderSummary(): Observable<any> {
    return this.http.post<any>(this.baseUrl + `/confirm`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(tap(r => r), catchError(this.handleErrorObservable));
  }

  // Get an overview of the order(it contains the order id)
  getBundleOrderSummary(): Observable<any> {
    return this.http.post<any>(this.baseUrl + `/bundleConfirm`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(tap(r => r), catchError(this.handleErrorObservable));
  }

  // To Empty cart, and clear session.
  onCreateOrder(): Observable<any> {
    return this.http.put<any>(this.baseUrl + `/confirm`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe();
  }

  // To Empty cart, and clear session.
  onCreateBundleOrder(): Observable<any> {
    return this.http.put<any>(this.baseUrl + `/bundleConfirm`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe();
  }

  // You only need to call this service, if you want to start payment process in webview.
  // You’ll know it’s finished when one of the following routes is loaded in the webview:
  // checkout/success (order success)
  // checkout/cart (order failed)
  pay(): Observable<any> {
    return this.http.get<any>(this.baseUrl + `/pay`)
      .pipe(map((r: any) => r.data));
  }
  // Get my orders
  getCustomersOrders(limit, page): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + `/customerorders/limit/${limit}/page/${page}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(map((r: any) => r.data as any[]));
  }
  getCustomerOrdersDetailsById(order_id): Observable<any> {
    return this.http.get<any>(this.baseUrl + `/customerorders/${order_id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(map((r: any) => r.data as any));
  }
  getCustomerOrdersDetailsWithTrackingById(order_id): Observable<any> {
    return this.http.get<any>(this.baseUrl + `/orderDetailwithtracking/${order_id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(map((r: any) => r.data as any));
  }
  reOrderProductById(order_id, order_product_id): Observable<any> {
    return this.http.post<any>(this.baseUrl + `/customerorders/${order_id}/product_id/${order_product_id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
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
