import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {OrdersService} from "../../../../services/orders.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-my-orders-details',
  templateUrl: './my-orders-details.component.html',
  styleUrls: ['./my-orders-details.component.css'],
})
export class MyOrdersDetailsComponent implements OnInit {
  displayedColumns = ['Product', 'SKU', 'Price', 'Quantity', 'Tracking Code', 'Total'];
  commentColumns = ['Date', 'Comment'];
  dataSource = new MatTableDataSource<any>();
  public orderDetails: any;
  public orderId;
  orderHistory = new MatTableDataSource<any>();
  public totalArray: any[];

  constructor(private ordersService: OrdersService,
              private route: ActivatedRoute,) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.orderId = params['order_id'];
    });
    this.getOrderDetails(this.orderId);
  }

  getOrderDetails(id) {
   this.ordersService.getCustomerOrdersDetailsWithTrackingById(id).subscribe(
     data => {
      this.orderDetails = data;
      this.dataSource.data = data.products;
       var orderhistory = [];
       var totalValue = [];
       for(let index = 0; index < this.orderDetails.totals.length; index++) {
         var value = this.orderDetails.currency.symbol_left + Number(this.orderDetails.totals[index].value).toFixed(this.orderDetails.currency.decimal_place) + this.orderDetails.currency.symbol_right;
         totalValue.push({title : this.orderDetails.totals[index].title, value: value});
         this.totalArray = totalValue;
       }
      for(let index = 0; index < this.orderDetails.histories.length; index++) {
        if(this.orderDetails.histories[index].notify !== "0") {
          orderhistory.push(this.orderDetails.histories[index]);
          this.orderHistory.data = orderhistory
        }
      }
     }
   );
  }

  copyMessage(tracking) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = tracking;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
