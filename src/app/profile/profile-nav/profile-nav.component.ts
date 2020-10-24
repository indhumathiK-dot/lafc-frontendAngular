import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {BestSellerHttpService} from "../../core/services/http/bestsellerhttpservice";

@Component({
  selector: 'app-profile-nav',
  templateUrl: './profile-nav.component.html',
  styleUrls: ['./profile-nav.component.css']
})
export class ProfileNavComponent implements OnInit {
  account: number;
  constructor(public router: Router, private bestSellerHttpService: BestSellerHttpService) {
    this.bestSellerHttpService.addressUpdate.subscribe(res => {
      if(res) {
        this.account = 2;
        this.bestSellerHttpService.addressUpdate.next(false);
      }
    });
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
    });
    this.account  = this.router.url === '/account/orders' ? 1 :
      (this.router.url === '/account/address' ? 2 : (this.router.url === '/account/wishlist' ? 3 : (this.router.url === '/account/cards' ? 4 : 1)))
  }

  tabChangeUpdate(type) {
    this.account = type === 'account' ? 1 : (type === 'address' ? 2 : (type === 'wishlist' ? 3 : (type === 'cards' ? 4 : 1)));
  }
}
