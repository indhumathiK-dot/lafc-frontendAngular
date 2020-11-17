import { Component, OnInit } from '@angular/core';
import { CheckoutService } from 'src/app/services/checkout.service';
import { PlatformLocation } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {OrdersService} from "../../services/orders.service";

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent implements OnInit {
  public orderId: any;
  public orderDetails: any;
  public customerDetails: any;

  constructor(private ordersService: OrdersService, private router: Router, private location: PlatformLocation,
              private route: ActivatedRoute) {
    window.scrollTo(0, 0);
    location.onPopState(() => {
      this.router.navigate(['/cart', 'orderSuccess']);
      history.forward();
    });
  }

  ngOnInit() {
    // alert('Order created successfully.You can view the details and track the order from the accounts section.')
    let user = localStorage.getItem('user');
    this.customerDetails = JSON.parse(user);
    this.orderId = sessionStorage.getItem('orderId');
    this.getOrderDetails(this.orderId);
  }

  getOrderDetails(id) {
    this.ordersService.getCustomerOrdersDetailsWithTrackingById(id).subscribe(
      data => {
        this.orderDetails = data;
      }
    );
  }

}
