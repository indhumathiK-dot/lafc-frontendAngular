import { Component, OnInit } from '@angular/core';
import {CheckoutService} from "../../services/checkout.service";
import {NgOption} from "@ng-select/ng-select";
import {CreateOrderService} from "../../services/create-order.service";
import {take} from "rxjs/operators";
import {PaymentMethodsService} from "../../services/payment-methods.service";
import {BestSellerHttpService} from "../../core/services/http/bestsellerhttpservice";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  public shippingAddress = '';
  public customerDetails: any;
  shippingMethods: NgOption = [];
  public notesValidation: boolean = false;
  private shippingValue = 'UPS Ground';
  public validateNote = false;

  constructor(private checkoutService: CheckoutService,
              public createOrderService: CreateOrderService,
              public paymentMethods: PaymentMethodsService,
              public bestSellerHttpService: BestSellerHttpService) { }

  ngOnInit() {
    this.shippingMethods = [
      {
        value: 1,
        label: 'UPS Ground'
      },
      {
        value: 2,
        label: 'UPS Ground - Customer UPS account'
      },
      {
        value: 3,
        label: 'Consolidated Shipper'
      }
    ];
    let user = localStorage.getItem('user');
    this.customerDetails = JSON.parse(user);
    var addressId = localStorage.getItem('shipAddrId');
    this.getAddressListById(addressId);
  }

  paymentMethodSelect() {
    this.paymentMethods.getPaymentMethods().pipe(take(1)).subscribe(
      data => {
        this.createOrderService.selectedPaymentMethod = data.payment_methods[0].code;
        this.createOrderService.onPaymentMethodSelect(data.payment_methods[0].code);
      }
    );
  }

  checkout() {
    if(!this.notesValidation) {
      let comment = (this.createOrderService.shippingComment ? this.createOrderService.shippingComment : '') + ' ' + this.shippingValue;
      this.createOrderService.shippingComment = comment;
      this.paymentMethodSelect();
      setTimeout(() => {
        this.checkoutService.getOrderSummary();
      }, 1000);
    } else {
      this.validateNote = true;
      alert('Please add the notes for the order');
    }
  }

  shippingMethodChange(value: any) {
    this.notesValidation = value == 3;
    this.validateNote = this.validateNote ? value == 3 : false;
    this.shippingValue = value == 1 ? 'UPS Ground' : (value == 2 ? 'UPS Ground - Customer UPS account' : (value == 3 ? 'Consolidated Shipper' : 'UPS Ground'));
  }

  getAddressListById(addressId: string) {
    this.bestSellerHttpService.getAddressById(addressId).pipe(take(1))
      .subscribe((res) => {
        this.shippingAddress = res['data'].company + ' ' + res['data'].address_1 + ' ' + res['data'].address_2 + ' ' + res['data'].postcode +  ' ' + res['data'].zone +  ' ' + res['data'].country;
      });
  }

  getNotes(value: any) {
    this.notesValidation = false;
    this.validateNote = false;
   this.createOrderService.shippingComment = value;
  }
}
