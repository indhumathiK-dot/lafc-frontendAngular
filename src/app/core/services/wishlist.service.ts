import { BestSellerHttpService } from "./http/bestsellerhttpservice";
import { filter } from "minimatch";
import { BehaviorSubject, Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { throwError, Observable, of } from "rxjs";
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class WishListService {
  private baseUrl = environment.base_url;
  private _whishlist = null;

  private _prodId = {};
  public wishListCount: number;
  public whishListCountSub: Subject<any> = new Subject();

  constructor(
    public http: HttpClient,
    private bestSellerHttpService: BestSellerHttpService
  ) {
    if (this.bestSellerHttpService.getCurrentUser()) {
      this.getWishListFromAPI().subscribe();
    }
  }

  getWishListFromAPI(isClear = false): Observable<any> {
    // if (!this._whishlist || isClear) {
      return this.http.get<any>(this.baseUrl + '/wishlist').pipe(
        map((res) => {
          //on success
          this._whishlist = res.data;
          this.wishListCount = res.data.length;
          // this.whishListCountSub.next(this.wishListCount);
          res.data.map(data => (this._prodId[data.product_id] = true));
          return res;
        }),
        catchError(this.handleErrorObservable)
      );
    // } else {
    //   return of(this._whishlist);
    // }
  }
  getBundleWishListFromAPI(isClear = false): Observable<any> {
    // if (!this._whishlist || isClear) {
    var imageDimesions = JSON.parse(localStorage.getItem('image-dimension'))
    return this.http.get<any>(this.baseUrl + '/bundleWishlist', {
      headers: new HttpHeaders({
      'x-oc-image-dimension' : imageDimesions.theme_default_image_wishlist_width + 'x' + imageDimesions.theme_default_image_wishlist_height,
      })
    }).pipe(
      map((res) => {
        //on success
        this._whishlist = res.data;
        this.wishListCount = res.data.length;
        // this.whishListCountSub.next(this.wishListCount);
        res.data.map(data => (this._prodId[data.product_id] = true));
        return res;
      }),
      catchError(this.handleErrorObservable)
    );
    // } else {
    //   return of(this._whishlist);
    // }
  }

  postWishListFromAPI(id): Observable<any> {
    return this.http.post(this.baseUrl + `/wishlist/${id}`, {}).pipe(
      map(res => {
        //on success
        //this.getWishListFromAPI(true).subscribe();
        // this.whishListCountSub.next(this.wishListCount + 1);
        return res;
      })
    );
  }

  public deleteWishList(id): Observable<any> {
    return this.http.delete(this.baseUrl + `/wishlist/${id}`, {}).pipe(
      map(res => {
        //on succews
        // this.getWishListFromAPI(true).subscribe();
        // this.whishListCountSub.next(this.wishListCount);
        return res;
      })
    );
  }

  public isWishListed(id): boolean {
    return this._prodId.hasOwnProperty(id);
  }

  private handleErrorObservable(error: Response | any) {
    return throwError(new Error("Bad Respone!"));
  }
}
