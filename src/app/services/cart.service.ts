import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { ICartData } from "../models/cart.model";
import { map } from "rxjs/internal/operators/map";
import { catchError } from "rxjs/operators";
import { Subject } from "rxjs";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root"
})
export class CartService {
  private baseUrl = environment.base_url;
  public addToCartCount: number;
  public addToCartCountSub: Subject<any> = new Subject();
  public addtoCart: any;
  public addToCartSub: Subject<any> = new Subject();
  public cartimage: Subject<any> = new Subject();
  public cartListUpdate: Subject<any> = new Subject();


  constructor(private http: HttpClient) { }

  addProductToCart(cartObject, product): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + '/bundleCart', cartObject, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      })
      .pipe(
        map(res => {
          // this.addToCartCountSub.next(this.addToCartCount + 1);
          // this.addToCartSub.next(res);
          // this.cartimage.next(product.image);
          return res;
        }), catchError(this.handleErrorObservable)
      );
  }

  getCartProducts(): Observable<ICartData> {
    return this.http.get<ICartData>(this.baseUrl + '/cart', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      map((r: any) => {
        this.addToCartCount =
          r.data && r.data.products && r.data.products.length
            ? r.data.products.length
            : 0;
        // this.addToCartCountSub.next(this.addToCartCount);
        return r.data as ICartData;
      })
    );
  }

  getCartBundleProducts(): Observable<ICartData> {
    var imageDimesions = JSON.parse(localStorage.getItem('image-dimension'))
    return this.http.get<ICartData>(this.baseUrl + '/bundleCart', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-oc-image-dimension' : imageDimesions.theme_default_image_cart_width + 'x' + imageDimesions.theme_default_image_cart_height,
      })
    }).pipe(
      map((r: any) => {
        this.addToCartCount =
          r.data && r.data.products && r.data.products.length
            ? r.data.products.length
            : 0;
        // this.addToCartCountSub.next(this.addToCartCount);
        return r.data as ICartData;
      })
    );
  }

  getBuynowCartBundleProducts(id): Observable<ICartData> {
    var imageDimesions = JSON.parse(localStorage.getItem('image-dimension'))
    return this.http.get<ICartData>(this.baseUrl + `/buynowBundleCart/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-oc-image-dimension' : imageDimesions.theme_default_image_cart_width + 'x' + imageDimesions.theme_default_image_cart_height,
      })
    }).pipe(
      map((r: any) => {
        this.addToCartCount =
          r.data && r.data.products && r.data.products.length
            ? r.data.products.length
            : 0;
        // this.addToCartCountSub.next(this.addToCartCount);
        return r.data as ICartData;
      })
    );
  }

  updateProductQuantity(cartObject): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/cart', cartObject, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    });
  }

  deleteCartProduct(key) {
    return this.http.delete(this.baseUrl + '/cart' + `/${key}`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).pipe(
      map(res => {
        // this.addToCartCountSub.next(--this.addToCartCount);
        return res;
      })
    );
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

  simpleConfirm(): Observable<any> {
    return this.http
      .post<any>(this.baseUrl + '/simpleconfirm', {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      })
      .pipe(
        map(res => {
          return res;
        }), catchError(this.handleErrorObservable)
      );
  }
}
