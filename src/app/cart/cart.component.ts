import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CartService } from '../services/cart.service';
import { ICartData } from '../models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartData: ICartData;
  constructor(public router: Router) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
    });

  }

  routerNavigate(url: string) {
    if(url === '/' || url === '/cart/items') {
      sessionStorage.removeItem('buyNowProduct');
    }
    this.router.navigate([url]);
  }
}
