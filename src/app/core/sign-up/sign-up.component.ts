import { informationServices } from '../../home/information/information.service';
import { BestSellerHttpService } from "./../services/http/bestsellerhttpservice";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from '../services/authentication.service';
import { AppAccessService } from '../services/app-access.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { GoogleLoginProvider, AuthService, FacebookLoginProvider } from 'angularx-social-login';


@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"]
})
export class SignUpComponent implements OnInit {
  userDetailsData = [];
  registeredUserSuccess: number;
  termAndCondition: any;
  loginRef;
  registerModalRef;
  user;
  registerApiResponse;
  loggedIn;
  newErrorMsg;
  noEmailMatch;
  isError = false;
  constructor(
    public bestSellerHttpService: BestSellerHttpService,
    public router: Router,
    public authService: AuthService,
    public informationServices: informationServices,
    public authenticationService: AuthenticationService,
    public appAccessService: AppAccessService,
    private spinner: NgxSpinnerService,
    public modalService: BsModalService,
    private bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
    this.getInformationAPI();
  }

  signup(userDetails) {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
    const obj = {
      "firstname": userDetails.firstname,
      "lastname": userDetails.lastname,
      "email": userDetails.email,
      "password": userDetails.password,
      "confirm": userDetails.confirm,
      "telephone": userDetails.telephone,
      "fax": "",
      "agree": userDetails.agree,
      "FCM_Token": ""
    };

    this.authenticationService.register(obj).subscribe(res => {
      if ((res.data !== null) && (res.data !== undefined)) {
        this.hideModal();
        // this.loggedIn = true;
        // JSON.stringify(localStorage.setItem('loggedIn', this.loggedIn));
        // this.registerApiResponse = res.data;
        // localStorage.setItem('user', JSON.stringify(this.registerApiResponse));
        // this.router.navigate(['/']);
        // location.reload(true);
      }
    }, (error) => {
      this.newErrorMsg = error.error.map(error => error);
      this.noEmailMatch = this.newErrorMsg[0];
      this.isError = true;
    });

    // this.appAccessService.register(obj);
    // if (JSON.parse(localStorage.getItem('loggedIn'))) {
    //   this.hideModal();
    // }
  }

  getInformationAPI() {
    this.informationServices.getInfo().subscribe(res => {
      res["data"].map(data => {
        if (data.title === "Terms &amp; Conditions") {
          this.termAndCondition = data;
        }
      });
    });
  }
  openLoginModal() {
    this.hideModal();
  }
  hideModal() {
    this.bsModalRef.hide();
    let state = sessionStorage.setItem("once", 'true');
  }
  signInWithGoogle(): void {
    console.log("signInWithGoogle called");
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
      this.authService.authState.subscribe((user) => {
        this.user = user;
        if ((user !== null) && (user !== undefined)) {
          const obj = {
            "email": user.email,
            "social_access_token": user.authToken,
            "provider": "google",
            "FCM_Token": ""
          };
          this.authenticationService.postSocialLogin(obj).subscribe(data => {
            if (data.success === 1) {
              this.hideModal();
              localStorage.setItem('user', JSON.stringify(data.data));
              this.appAccessService.loggedIn = (user !== null);
              JSON.stringify(localStorage.setItem('loggedIn', 'true'));
              JSON.stringify(localStorage.setItem('isSocialLogin', 'true'));
              this.router.navigate(['/']);
              location.reload(true);
            }
          });
        }
      });
    });
  }
  signInWithFacebook() {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(user => {
      this.authService.authState.subscribe((user) => {
        this.user = user;
        if ((user !== null) && (user !== undefined)) {
          const obj = {
            "email": user.email,
            "social_access_token": user.authToken,
            "provider": "facebook",
            "FCM_Token": ""
          };
          this.authenticationService.postSocialLogin(obj).subscribe(data => {
            if (data.success === 1) {
              this.hideModal();
              localStorage.setItem('user', JSON.stringify(data.data));
              this.appAccessService.loggedIn = (user !== null);
              JSON.stringify(localStorage.setItem('loggedIn', 'true'));
              JSON.stringify(localStorage.setItem('isSocialLogin', 'true'));
              this.router.navigate(['/']);
              location.reload(true);
            }
          });
        }
      });
    });
  }
  closed() {
    this.appAccessService.isError = false;
  }
}
