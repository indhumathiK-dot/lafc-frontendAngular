import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Products, Product } from "../models/products.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root"
})
export class ProductsService {
  private baseUrl = environment.base_url;
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this.http.get(this.baseUrl + '/products', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      map((r: any) => r.data as any)
    );
  }
  getProductsByCategoryId(category_id): Observable<Product[]> {
    return this.http
      .get<Products>(this.baseUrl + `/products/category/${category_id}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(map((r: any) => r.data as Product[]));
  }

  getBundleProductsByCategoryId(category_id): Observable<Product[]> {
    var imageDimesions = JSON.parse(localStorage.getItem('image-dimension'));
    return this.http
      .get<Products>(this.baseUrl + `/bundleProducts/category/${category_id}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-oc-image-dimension' : imageDimesions.theme_default_image_product_width + 'x' + imageDimesions.theme_default_image_product_height,
        })
      })
      .pipe(map((r: any) => r.data as Product[]));
  }

  getBundleProductsByCategoryIdByLimit(category_id, limit, page): Observable<Product[]> {
    var imageDimesions = JSON.parse(localStorage.getItem('image-dimension'));
    return this.http
      .get<Products>(this.baseUrl + `/bundleProducts/category/${category_id}/limit/${limit}/page/${page}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-oc-image-dimension' : imageDimesions.theme_default_image_product_width + 'x' + imageDimesions.theme_default_image_product_height,
        })
      })
      .pipe(map((r: any) => r.data as Product[]));
  }

  getProductById(product_id): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + `/products/${product_id}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-oc-image-dimension' : 500 + 'x' + 500,
        })
      })
      .pipe(map((r: any) => r.data as Product));
  }

  getBundleProductById(product_id): Observable<any> {
    var imageDimesions = JSON.parse(localStorage.getItem('image-dimension'))
    return this.http
      .get<any>(this.baseUrl + `/bundleProducts/${product_id}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-oc-image-dimension' : imageDimesions.theme_default_image_product_width + 'x' + imageDimesions.theme_default_image_product_height,
        })
      })
      .pipe(map((r: any) => r.data as Product));
  }

  getRelatedProductById(product_id): Observable<any> {
    return this.http
      .get<any>(this.baseUrl + `/related/${product_id}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(map((r: any) => r.data as Product));
  }
  getRelatedBundleProductById(product_id): Observable<any> {
    var imageDimesions = JSON.parse(localStorage.getItem('image-dimension'))
    return this.http
      .get<any>(this.baseUrl + `/bundleRelated/${product_id}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-oc-image-dimension' : imageDimesions.theme_default_image_related_width + 'x' + imageDimesions.theme_default_image_related_height,
        })
      })
      .pipe(map((r: any) => r.data as Product));
  }

  getBrandDetailsById(brand_id): Observable<any> {
    return this.http.get(this.baseUrl + `/manufacturers/${brand_id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  getProductsByMnfctrID(brand_id): Observable<any> {
    var imageDimesions = JSON.parse(localStorage.getItem('image-dimension'));
    return this.http
      .get(this.baseUrl + `/products/manufacturer/${brand_id}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-oc-image-dimension' : imageDimesions.theme_default_image_related_width + 'x' + imageDimesions.theme_default_image_related_height,
        })
      })
      .pipe(map((res: any) => res.data));
  }

  getBundleProductsByMnfctrID(brand_id): Observable<any> {
    var imageDimesions = JSON.parse(localStorage.getItem('image-dimension'));
    return this.http
      .get(this.baseUrl + `/bundleProducts/manufacturer/${brand_id}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-oc-image-dimension' : imageDimesions.theme_default_image_related_width + 'x' + imageDimesions.theme_default_image_related_height,
        })
      })
      .pipe(map((res: any) => res.data));
  }

  getBundleProductsByMnfctrIDByLimit(brand_id, limit, page): Observable<any> {
    var imageDimesions = JSON.parse(localStorage.getItem('image-dimension'));
    return this.http
      .get(this.baseUrl + `/bundleProducts/manufacturer/${brand_id}/limit/${limit}/page/${page}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-oc-image-dimension' : imageDimesions.theme_default_image_related_width + 'x' + imageDimesions.theme_default_image_related_height,
        })
      })
      .pipe(map((res: any) => res.data));
  }

  addProductReview(product_id, reviewObj): Observable<any> {
    return this.http.post<any>(this.baseUrl + `/products/${product_id}/review`, reviewObj, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  returnProduct(returnObj): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/returns', returnObj, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  searchProduct(searchWord, limit, page): Observable<any> {
    return this.http.get(this.baseUrl + `/products/search/${searchWord}/limit/${limit}/page/${page}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  searchBundleProduct(searchWord, limit, page): Observable<any> {
    return this.http.get(this.baseUrl + `/bundleProducts/search/${searchWord}/limit/${limit}/page/${page}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  searchProductWithoutFilter(searchWord): Observable<any> {
    return this.http.get(this.baseUrl + `/products/search/${searchWord}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  searchBundleProductWithoutFilter(searchWord): Observable<any> {
    return this.http.get(this.baseUrl + `/bundleProducts/search/${searchWord}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  addToRecentView(viewObject): Observable<any> {
    return this.http.post(this.baseUrl + '/recentviewadd', viewObject, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  getRecentView(id): Observable<any> {
    return this.http.get<any>(this.baseUrl + `/recentview/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  notify(product_id, notifyObj): Observable<any> {
    return this.http.post<any>(this.baseUrl + `/notifyme/${product_id}`, notifyObj, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  searchProducts(param): Observable<any> {
    return this.http.get<any>(this.baseUrl + `/websearch/${param}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
