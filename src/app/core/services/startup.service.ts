import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API, AUTH } from "./../config/url.config";
import { CategoryFilterService } from 'src/app/category/category-filter.service';

type AUTH = {
  access_token: String;
  expires_in: number;
  token_type: string;
};

@Injectable()
export class StartupService {
  constructor(public http: HttpClient,private catFilter:CategoryFilterService) { }
  private _AUTH_TOKEN: AUTH = <any>{}

  public async getAuthToken() {
    let token$ =  new Promise((resolve, reject) => {
      let auth = localStorage.getItem('auth')
      if (auth) {
        this._AUTH_TOKEN = JSON.parse(auth);
        resolve(this._AUTH_TOKEN);
        return;
      }
      let headers = new HttpHeaders();
      headers = headers.set("Content-Type", "application/json; charset=utf-8");
      headers = headers.append("Authorization", 'Basic c2hvcHBpbmdfb2F1dGhfY2xpZW50OnNob3BwaW5nX29hdXRoX3NlY3JldA==');
      this.http
        .post(API.BASE_URL + API.OAUTH_TOKEN, {}, { headers: headers })
        .subscribe(res => {
          this._AUTH_TOKEN = res["data"];
          localStorage.setItem('auth',JSON.stringify(this._AUTH_TOKEN));
          resolve(res);
        });
    });
    const token = await token$;
    await this.catFilter.buildFilterTree();
    return token;
  }

  public get Token(): string {
    return this._AUTH_TOKEN.token_type + " " + this._AUTH_TOKEN.access_token;
  }

  public get keyonly(): any {
    return this._AUTH_TOKEN.access_token;
  }
}
