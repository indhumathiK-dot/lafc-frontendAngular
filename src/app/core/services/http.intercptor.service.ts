import { StartupService } from "./startup.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpInterceptor } from "@angular/common/http";
import { API } from "./../config/url.config";

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private startupService: StartupService) {}
  intercept(req: any, next: any): Observable<any> {
    if (req.url.indexOf(API.OAUTH_TOKEN) === -1) {
      const reqh = req.clone({
        headers: req.headers.append(
          "Authorization", this.startupService.Token,
          "x-oc-image-dimension",
        )
      });
      return next.handle(reqh);
    }
    return next.handle(req);
  }
}
