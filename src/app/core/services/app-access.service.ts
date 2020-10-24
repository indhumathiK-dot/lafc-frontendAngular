import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { BestSellerHttpService } from './http/bestsellerhttpservice';
import { EventsService } from './events.service';

@Injectable({
  providedIn: 'root'
})
export class AppAccessService {
  loggedIn;
  loginApiResponse;
  registerApiResponse;
  currentUserFlag;
  categorylevel1;
  categoryList;
  currentUserDetails;
  isSocialUser;
  brandsList;

  newErrorMsg;
  noEmailMatch;
  isError = false;

  loginModalDismiss;
  constructor(
    private authService: AuthenticationService,
    private events: EventsService,
    private bestsellerhttpservice: BestSellerHttpService,
    private router: Router) { }

  register(registerObject) {
    this.authService.register(registerObject).subscribe(res => {
      if ((res.data !== null) && (res.data !== undefined)) {
        this.loggedIn = true;
        JSON.stringify(localStorage.setItem('loggedIn', this.loggedIn));
        this.registerApiResponse = res.data;
        localStorage.setItem('user', JSON.stringify(this.registerApiResponse));
        this.router.navigate(['/']);
        location.reload(true);
      }
    }, (error) => {
      this.newErrorMsg = error.error.map(error => error);
      this.noEmailMatch = this.newErrorMsg[0];
      this.isError = true;
    });
  }
  login(loginObject, isCart) {
    this.authService.login(loginObject).subscribe(res => {
      if ((res.data !== null) && (res.data !== undefined)) {
        this.loggedIn = true;
        JSON.stringify(localStorage.setItem('loggedIn', this.loggedIn))
        this.loginApiResponse = res.data;
        localStorage.setItem('user', JSON.stringify(this.loginApiResponse));
        this.events.loginEvent$.emit(true);
        if (isCart === true) {
          this.router.navigate(['/cart', 'items']);
          location.reload(true);
        } else {
          this.router.navigate(['/']);
          location.reload(true);
        }
      }
    }, (error) => {
      this.newErrorMsg = error.error.map(error => error);
      this.noEmailMatch = this.newErrorMsg[0];
      this.isError = true;
    });
  }
  getCurrentUserLoginFlag() {
    this.currentUserFlag = JSON.parse(localStorage.getItem('loggedIn'));
    return this.currentUserFlag;
  }
  getCurrentUserDetails() {
    if (localStorage.getItem('user')) {
      return this.currentUserDetails = JSON.parse(localStorage.getItem('user'));
    } else {
      return;
    }
  }
  getUsertype() {
    if (localStorage.getItem('socialuser')) {
      this.isSocialUser = true;
    } else {
      this.isSocialUser = false;
    }
  }
  getBrands() {
    this.bestsellerhttpservice.getAllBrands().subscribe(res => {
      if (res.success === 1) {
        this.brandsList = res;
      }
    });
  }

}
