import { Injectable } from '@angular/core';
import { OrdersService } from './orders.service';
import { CreateOrderService } from './create-order.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { $ } from 'protractor';
import { BehaviorSubject } from 'rxjs';

export class CreateOrder {
  constructor(public paymentAddId: string, public saddId: string, public shipMethId: string) {
  }
}
@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  public orderSummaryData: any;
  public orderCreateRes: any;
  public payStatus: any;
  paymentHtml: any;
  isCCAvenue: boolean = false;


  newErrorMsg;
  noPaymentMethodSelected;
  isError = false;

  isOrderSummaryFailed = false;

  private payStatusUrl = new BehaviorSubject(null);
  constructor(
    private router: Router,
    private ordersService: OrdersService,
    private sanitizer: DomSanitizer,
    private createOrderService: CreateOrderService) { }
  // Proceed to checkout
  getOrderSummary() {
    return this.ordersService.getBundleOrderSummary().subscribe(
      data => {
        this.orderSummaryData = data;
        if (this.createOrderService.selectedPaymentMethod === 'ccavenuepay') {
          this.isCCAvenue = true;
          window.onpopstate = (e) => {
            this.payStatusUrl.next(e);
          };
          return;
          //this.router.navigate(['/orderSummary', this.orderSummaryData.data.order_id]);
        } else {
          this.createOrder();
          sessionStorage.setItem('orderId', this.orderSummaryData.data.order_id);
        }
      }, (error) => {
        this.isOrderSummaryFailed = true;
        this.newErrorMsg = error.error.map(error => error);
        this.noPaymentMethodSelected = this.newErrorMsg[0];
        this.isError = true;
        var sa = localStorage.getItem('shipAddrId');
        var pa = localStorage.getItem('paymentAddrId');
        var sm = localStorage.getItem('shippingMethod');
        let createOrder = new CreateOrder(pa, sa, sm);
        this.ordersService.createOrderAS(createOrder);
        this.createOrderService.getPaymentMethods();
      }
    );
  }

  getBuynowOrderSummary(productId) {
    return this.ordersService.getBuynowBundleOrderSummary(productId).subscribe(
      data => {
        this.orderSummaryData = data;
        if (this.createOrderService.selectedPaymentMethod === 'ccavenuepay') {
          this.isCCAvenue = true;
          window.onpopstate = (e) => {
            this.payStatusUrl.next(e);
          };
          return;
          //this.router.navigate(['/orderSummary', this.orderSummaryData.data.order_id]);
        } else {
          this.buynowCreateOrder();
          sessionStorage.setItem('orderId', this.orderSummaryData.data.order_id);
        }
      }, (error) => {
        this.isOrderSummaryFailed = true;
        this.newErrorMsg = error.error.map(error => error);
        this.noPaymentMethodSelected = this.newErrorMsg[0];
        this.isError = true;
        var sa = localStorage.getItem('shipAddrId');
        var pa = localStorage.getItem('paymentAddrId');
        var sm = localStorage.getItem('shippingMethod');
        let createOrder = new CreateOrder(pa, sa, sm);
        this.ordersService.createOrderAS(createOrder);
        this.createOrderService.getPaymentMethods();
      }
    );
  }

  getSanitizedValue() {
    return this.sanitizer.bypassSecurityTrustHtml(this.orderSummaryData.data.payment);
  }
  createOrder() {
    this.ordersService.onCreateBundleOrder().subscribe(
      data => {
        this.orderCreateRes = data;
        this.router.navigate(['/cart/orderSuccess']);
      },
      (err) => {
      }
    )
  }
  buynowCreateOrder() {
    this.ordersService.onCreateBuynowBundleOrder().subscribe(
      data => {
        this.orderCreateRes = data;
        sessionStorage.removeItem('buyNowProduct');
        this.router.navigate(['/cart/orderSuccess']);
      },
      (err) => {
      }
    )
  }
  gotoPay() {
    this.ordersService.pay().subscribe(
      data => {
        this.payStatus = data;
      }
    );
  }
  gotoCheckout() {
    this.ordersService.pay().subscribe(
      data => {
        this.payStatus = data;
      }
    );
  }
}
