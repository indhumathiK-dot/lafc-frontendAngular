import {Observable, BehaviorSubject, throwError, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private baseUrl = environment.base_url;
  private vendorVendorUrl = environment.vendor_base_url;

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(public http: HttpClient,
              private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  register(obj): Observable<any> {
    return this.http.post(this.baseUrl + '/register', obj)
      .pipe(
        map((res: any) => {
          if (res) {
            this.router.navigate(['/']);
            alert('Thank you for registering with LAFC! You will be notified by e-mail once your account has been activated by the store owner.');
            // localStorage.setItem('user', JSON.stringify(res.data));
            // this.currentUserSubject.next(res);
          } else {
            alert('htghjfg')
          }
          return res;
        }), catchError(
          (err: any) => of(err)
          ));
  }

  invoiceUpload(data){
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(this.vendorVendorUrl + '/ccAuthUpload', data,  { headers: headers });
  }

  updatePath(data) {
    return this.http.post(this.vendorVendorUrl + '/updateCCPath', data);
  }

  getCustomerDetails(customerId) {
    return this.http.get(this.vendorVendorUrl + '/customerDetails' + '?customerId=' + customerId);
  }

  updateAccount(obj): Observable<any> {
    return this.http
      .put(this.baseUrl + '/account', obj)
      .pipe(
        map((res: any) => {
          if (res) {
            localStorage.setItem('user', JSON.stringify(res.data));
            this.currentUserSubject.next(res);
          }
          return res;
        }), catchError(this.handleErrorObservable));
  }

  login(obj): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/login', obj);
  }

  postSocialLogin(obj): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/sociallogin', obj, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      map((res: any) => {
        // if (res) {
        //   localStorage.setItem('socialuser', JSON.stringify(res.data));
        // }
        return res;
      }), catchError(this.handleErrorObservable));
  }

  contactMessage(obj): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/contact', obj, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      map((res: any) => {
        return res;
      }), catchError(this.handleErrorObservable));
  }

  logOutCurrentUser() {
    return this.http
      .post(this.baseUrl + '/logout', {}, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(map(data => {
        localStorage.removeItem('user'),
          this.currentUserSubject.next(null);
      }), catchError(this.handleErrorObservable));
  }

  private extractData(res: Response) {
    return res;
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
    };
    return throwError(error.error);
  }
}
