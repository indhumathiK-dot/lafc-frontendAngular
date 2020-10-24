import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(req.url.endsWith('/checkout/success')) {
            return next.handle(req);
        }
        if (req.url.endsWith('/checkout/failure')){
            return next.handle(req);
        }
        return next.handle(req);
    }
}