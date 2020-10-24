
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import {
    Observable,
} from "rxjs";
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
})
export class informationServices {
    private baseUrl = environment.base_url;
    constructor(private http: HttpClient, public route: Router, public activatedRoute: ActivatedRoute) { }

    getInfo(): Observable<any> {
        return this.http.get(this.baseUrl + '/information')
            .pipe(map(this.extractData), catchError(this.handleErrorObservable))
    }

    getInfoById(id): Observable<any> {
        return this.http.get(this.baseUrl + '/information' + `/${id}`);
    }

  getStoreInfo(id): Observable<any> {
    return this.http.get(this.baseUrl + '/stores' + `/${id}`);
  }

    getAboutUsInfoByID(info_id): Observable<any> {
        return this.http.get(this.baseUrl + '/information' + `/${info_id}`)
            .pipe(map(this.extractData), catchError(this.handleErrorObservable))
    }

    getTermsAndCondition(info_id): Observable<any> {
        return this.http.get(this.baseUrl + '/information' + `/${info_id}`)
            .pipe(map(this.extractData), catchError(this.handleErrorObservable))
    }

    getExchangeAndReplacement(id): Observable<any> {
        return this.http.get(this.baseUrl + '/information' + `/${id}`)
            .pipe(map(this.extractData), catchError(this.handleErrorObservable))
    }

    geReturnPolicy(id): Observable<any> {
        return this.http.get(this.baseUrl + '/information' + `/${id}`)
            .pipe(map(this.extractData), catchError(this.handleErrorObservable))
    }

    getCancellationPolicy(id): Observable<any> {
        return this.http.get(this.baseUrl + '/information' + `/${id}`)
            .pipe(map(this.extractData), catchError(this.handleErrorObservable))
    }

    getPrivacyPolicy(id): Observable<any> {
        return this.http.get(this.baseUrl + '/information' + `/${id}`)
            .pipe(map(this.extractData), catchError(this.handleErrorObservable))
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
        }
        return throwError(error.error);
    }
}


