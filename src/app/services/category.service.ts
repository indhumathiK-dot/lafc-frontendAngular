import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError, map, tap, take } from 'rxjs/operators';
import { SubCategoryElement, Data } from '../models/category.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl: any = environment.base_url;
  selectedCategories: Map<string, string> = new Map();
  categories: Map<string, SubCategoryElement> = new Map();
  constructor(public http: HttpClient) { }
  getCategories(): Observable<any> {
    return this.http.get(this.baseUrl + '/categories', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(map(res => { return res;
    }))
      .pipe(catchError(this.handleErrorObservable));
  }
  getCategoriesById(category_id) {
    return this.http.get(this.baseUrl + '/categories' + `/${category_id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      map((r: any) => r.data as SubCategoryElement),
      tap((elem => {
        this.categories.set(category_id, elem);
      })),
      catchError(this.handleErrorObservable));
  }
  getCategoriesByParentId(parent_id) {
    return this.http.get(this.baseUrl + '/categories' + `/parent/${parent_id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      map((r: any) => r.data as SubCategoryElement),
      catchError(this.handleErrorObservable));
  }
  getCategoriesByLevel(level) {
    return this.http.get(this.baseUrl + '/categories' + `/level/${level}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    })
      .pipe(
        map((r: any) => r.data as SubCategoryElement,
        ),
        catchError(this.handleErrorObservable));
  }
  getCategoriesByParentIdAndLevel(parentId: string, level: string) {
    return this.http.get(`${this.baseUrl + '/categories'}/parent/${parentId}/level/${level}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(
        map((r: any) => r.data as SubCategoryElement),
        catchError(this.handleErrorObservable));
  }
  private handleErrorObservable(error: Response | any) {
    return throwError(error.message || error);
  }

  isCatSelected(level, id) {
    const catId = this.selectedCategories.get(level);
    return catId && catId === id;
  }
  setCatSelected(level, id) {
    this.getCategoriesById(id).pipe(take(1)).subscribe(e => {
      this.categories.set(id, e);
    });
    this.selectedCategories.set(level, id);
  }
  private convertToSlug(Text) {
    return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-');
  }
  slug(text) {
    const slugged = this.convertToSlug(String(text));
    return slugged;
  }
  getSystemSettingDimension() {
    return this.http.get(this.baseUrl + '/getSystemImageDimesions', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    })
      .pipe(
        map((r: any) => r.data as SubCategoryElement,
        ),
        catchError(this.handleErrorObservable));
  }
}
