import { Component, OnInit, OnDestroy } from '@angular/core';
import { CreateOrderService } from 'src/app/services/create-order.service';
import { AddressService } from 'src/app/services/address.service';
import { Router } from '@angular/router';
import { CheckoutService } from 'src/app/services/checkout.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnDestroy {
  shippingAddressId;
  paymentAddressId;
  constructor(
    public createOrderService: CreateOrderService, 
    public checkoutService: CheckoutService,
    private spinner: NgxSpinnerService,
    public router: Router) { }

  ngOnInit() {
    this.createOrderService.loadCartProducts();
    this.shippingAddressId = JSON.parse(localStorage.getItem('shipAddrId'));
    this.paymentAddressId = JSON.parse(localStorage.getItem('paymentAddrId'));
    this.getSelectedAddresses();
  }

  getSelectedAddresses() {
    this.createOrderService.setSelectedAddressID(this.shippingAddressId, this.paymentAddressId);
  }

  getPaymentMethods() {
    this.createOrderService.getPaymentMethods();
  }
  onPaymentMethodSelect(ev, code) {
    this.createOrderService.selectedPaymentMethod = code;
    this.createOrderService.onPaymentMethodSelect(code);
  }
  onCheckoutProceed() {
    this.checkoutService.getOrderSummary();
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }
  // ngOnDestroy(): void {
  //   localStorage.removeItem('shipAddr');
  //   localStorage.removeItem('payAddr');
  // }
  retry() {
    this.router.navigate(['/']);
    location.reload(true);
  }
  ngOnDestroy(): void {
    this.checkoutService.isCCAvenue = false;
    // localStorage.removeItem('shipAddrId');
    // localStorage.removeItem('paymentAddrId');
    localStorage.removeItem('shippingMethod');
  }
}
