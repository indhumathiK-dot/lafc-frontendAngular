import { Router, ActivatedRoute } from "@angular/router";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { API } from "../../../core/config/url.config";


import {
  Observable,
  BehaviorSubject
} from "rxjs";
import { throwError } from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root"
})
export class BestSellerHttpService {
  private baseUrl = environment.base_url;
  public token: string;
  public addressUpdate = new BehaviorSubject(false);
  public showErrorMessage = '';
  public newErrorMessage = [];
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  constructor(
    private http: HttpClient,
    public route: Router,
    public activatedRoute: ActivatedRoute
  ) { }


  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  getBestSellerCarousel(): Observable<any> {
    return this.http
      .get(this.baseUrl + '/products')
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleErrorObservable));
  }

  getLatestProducts(): Observable<any> {
    return this.http
      .get(this.baseUrl + '/latest')
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleErrorObservable));
  }
  getBundleLatestProducts(): Observable<any> {
    var imageDimesions = JSON.parse(localStorage.getItem('image-dimension'))
    return this.http
      .get(this.baseUrl + '/bundleLatest',
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'x-oc-image-dimension' : imageDimesions.theme_default_image_product_width + 'x' + imageDimesions.theme_default_image_product_height,
          })
        }
        )
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleErrorObservable));
  }

  getBundleLatestProductsWithLimits(limit, page): Observable<any> {
    var imageDimesions = JSON.parse(localStorage.getItem('image-dimension'))
    return this.http
      .get(this.baseUrl + `/bundleLatest/limit/${limit}/page/${page}`,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'x-oc-image-dimension' : imageDimesions.theme_default_image_product_width + 'x' + imageDimesions.theme_default_image_product_height,
          })
        }
      )
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleErrorObservable));
  }

  getBannerAPI(): Observable<any> {
    return this.http
      .get(this.baseUrl + '/banners')
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleErrorObservable));
  }
  getBannerAPIByID(id): Observable<any> {
    return this.http.get(this.baseUrl + '/banners' + id, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getInformationAPI(): Observable<any> {
    return this.http
      .get(this.baseUrl + '/information')
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleErrorObservable));
  }

  getInformationByIDAPI(id): Observable<any> {
    return this.http
      .get(this.baseUrl +  `/information/${id}`)
      .pipe(map(this.extractData));
  }

  getCurrentUser() {
    let currentUser = JSON.parse(localStorage.getItem("user"));
    return currentUser;
  }

  getAllBrands(): Observable<any> {
    return this.http.get(this.baseUrl + '/manufacturers');
  }

  getBrandsByID(brand_id): Observable<any> {
    return this.http
      .get(this.baseUrl + `/manufacturers/${brand_id}`)
      .pipe(map((res: any) => res), catchError(this.handleErrorObservable));
  }

  postNewAddress(obj): Observable<any> {
    return this.http
      .post(this.baseUrl + '/account/address', obj)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleErrorObservable)
      );
  }

  postWishListItem(product_id) {
    return this.http.post(this.baseUrl + `/wishlist/${product_id}`, product_id)
      .pipe(map(this.extractData), catchError(this.handleErrorObservable));
  }

  deleteWishListItem(product_id) {
    return this.http.delete(this.baseUrl + `/wishlist/${product_id}`, product_id)
      .pipe(map((res: any) => res), catchError(this.handleErrorObservable))
  }

  updateNewPassword(newPassword) {
    return this.http.put(this.baseUrl + '/account/password', newPassword)
      .pipe(map(this.extractData)
        , catchError(this.handleErrorObservable));
  }

  getAddress() {
    return this.http
      .get(this.baseUrl + '/account/address')
      .pipe(map(this.extractData), catchError(this.handleErrorObservable));
  }
  getAddressById(addressId) {
    return this.http
      .get(this.baseUrl + `/account/address/${addressId}`)
      .pipe(map(this.extractData), catchError(this.handleErrorObservable));
  }

  getListofCountries(): Observable<any> {
    return this.http.get(this.baseUrl + '/countries')
      .pipe(map(this.extractData)
        , catchError(this.handleErrorObservable));
  }

  getListOfStates(id): Observable<any> {
    return this.http.get(this.baseUrl + `/countries/${id}`)
      .pipe(map(this.extractData), catchError(this.handleErrorObservable));
  }

  deleteAddressById(id) {
    return this.http.delete(this.baseUrl + `/account/address/${id}`)
      .pipe(map(this.extractData), catchError(this.handleErrorObservable));
  }

  getListOfSpecialProducts() {
    return this.http.get(this.baseUrl + '/specials')
      .pipe(map(this.extractData), catchError(this.handleErrorObservable));
  }

  getListOfDeals(): Observable<any> {
    return this.http.get(this.baseUrl + '/alldeals');
  }

  getDealsByApiID(id): Observable<any> {
    return this.http.get(this.baseUrl + `/getdealsproduct/${id}`);
  }

  getRecentlyViewedById(id) {

    return this.http.get(this.baseUrl + `/recentview/${id}`)
      .pipe(map(this.extractData), catchError(this.handleErrorObservable));
  }

  getWalletDetails(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/getWalletDetails')
      .pipe(map(this.extractData), catchError(this.handleErrorObservable));
  }

  updateAddressById(id, data) {
    return this.http.put(this.baseUrl + `/account/address/${id}`, data)
      .pipe(map(this.extractData), catchError(this.handleErrorObservable));
  }

  forgotPassword(email): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/forgotten', email);
      // .pipe(map(this.extractData), catchError(this.handleErrorObservable));
  }

  postForgotPassword(obj) {
    return this.http.put(this.baseUrl + '/account/resetPassword', obj)
      .pipe(map(this.extractData), catchError(this.handleErrorObservable));
  }

  getOrders() {
    return this.http.get(this.baseUrl + '/customerorders/limit/100/page/1')
      .pipe(map(this.extractData), catchError(this.handleErrorObservable));
  }

  getOrdersById(id) {

    return this.http.get(this.baseUrl + `/customerorders/${id}`)
      .pipe(map(this.extractData), catchError(this.handleErrorObservable));
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
    }
    return throwError(error.error);
  }
}
