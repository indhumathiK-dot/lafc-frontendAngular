import { Component, OnInit, Input, NgZone } from '@angular/core';
import { ICartData } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateOrderService } from 'src/app/services/create-order.service';

@Component({
  selector: 'app-price-details',
  templateUrl: './price-details.component.html',
  styleUrls: ['./price-details.component.css']
})
export class PriceDetailsComponent implements OnInit {

  @Input() cart: ICartData;
  codeEnteredData: any;
  codeEntered: string;
  isListOpen: boolean = true;

  useWalletBalance;
  marked: boolean = false;
  shippingPrice;
  newErrorMsg;
  couponInvalid;
  isError;
  isShippingMethodApplied = false;
  constructor(private cartService: CartService,
    public createOrderService: CreateOrderService,
    public ngZone: NgZone,
    public router: Router) { }

  ngOnInit() {
      this.calculateShippingPrice();
      if (localStorage.getItem('shippingMethod')) {
        this.isShippingMethodApplied = true;
        this.calculateShippingPrice();
      }
  }
  calculateShippingPrice() {
    if ((this.cart !== null) && (this.cart !== undefined)) {
    var totalPrice = this.getTotalsByTitle('Sub-Total').value;
    if (totalPrice < 2000) {
      this.shippingPrice = 100;
    } else {
      this.shippingPrice = (totalPrice * 5) / 100; 
    }
  }
  }
  toggleIcon() {
    this.isListOpen = !this.isListOpen;
  }
  onApplyCoupon(code) {
    this.codeEntered = code;
    this.createOrderService.applyCoupon(code).subscribe(
      data => {
        if (data.success === 1) {
          this.codeEnteredData = data;
          // this.createOrderService.loadCartProducts();
        }
      }, (error) => {
        this.newErrorMsg = error.error.map(error => error);
        this.couponInvalid = this.newErrorMsg[0];
        this.isError = true;
      });
  }
  removeCouponApplied() {
    this.createOrderService.removeCoupon();
  }
  onRemoveWalletBalance() {
    this.createOrderService.removeWalletBalanceApplied()
      .subscribe();
  }
  getTotalsByTitle(title: string) {
    let cartItem = this.cart;
    if (!cartItem) {
      return null;
    }
    let totals = cartItem.totals;
    if (totals === undefined) {
      return null;
    }
    return totals.find(tit => {
      if (title !== 'Total') {
      let has = tit.title.includes(title);
      return has;
      }
      if (tit.title === 'Total') {
        return true;
      }
    });
  }
  getAppliedCoupons() {
    return this.getTotalsByTitle('Coupon');
  }
  close() {
    this.isError = false;
  }

}
