import { Component, OnInit, NgZone } from '@angular/core';
import { AppAccessService } from '../services/app-access.service';
import { BsModalService } from 'ngx-bootstrap';
import { AuthService } from 'angularx-social-login';
import { AuthenticationService } from '../services/authentication.service';
import { StartupService } from '../services/startup.service';
import { Router } from '@angular/router';
import { EventsService } from '../services/events.service';
import { ProfileService } from 'src/app/profile/profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loginModalRef;
  registerModalRef;
  userDetails;
  constructor(
    public modalService: BsModalService,
    public router: Router,
    public events: EventsService,
    public appAccessService: AppAccessService,
    public socialAuthService: AuthService,
    public startupService: StartupService,
    public authenticationService: AuthenticationService,
    public ngZone: NgZone,
    public profileService: ProfileService) { }

  ngOnInit() {
    this.ngZone.run(() => {
      this.userDetails = JSON.parse(localStorage.getItem('user'));
    });
  }
  loadProfile() {
    this.profileService.getProfile().subscribe(data => {
      if (data.success === 1) {
        this.userDetails = data.data;
      }
    });
  }
  openRegister() {
    // this.registerModalRef = this.modalService.show(SignUpComponent);
  }

  logoutCurr() {
    if ((localStorage.getItem('isSocialLogin'))) {
      this.socialAuthService.signOut();
      localStorage.clear();
      this.appAccessService.loggedIn = false;
      this.startupService.getAuthToken().then(
        res => {
          this.events.logoutEvent$.emit(true);
          this.router.navigate(["/"]);
          location.reload(true);
        });
    } else {
      this.authenticationService.logOutCurrentUser().subscribe(
        res => {
          localStorage.clear();
          this.startupService.getAuthToken().then(
            res => {
              this.events.logoutEvent$.emit(true);
              this.router.navigate(["/"]);
              location.reload(true);
            });
        });
    }
  }

}
