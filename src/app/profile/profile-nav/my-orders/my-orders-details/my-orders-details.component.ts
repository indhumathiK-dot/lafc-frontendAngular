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
  displayedColumns = ['Product', 'SKU', 'Price', 'Quantity', 'Bundle Quantity', 'Tracking Code', 'Total'];
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

       let html = this.orderDetails.comment;
       let htmlObject = document.createElement('div');
       htmlObject.innerHTML = html;
       this.orderDetails.comment = htmlObject.innerText;

       this.orderDetails.comment = this.orderDetails.comment.split('<br>');
       console.log(this.orderDetails.comment);

       for(let productIndex = 0; productIndex < data.products.length; productIndex++) {
         var quantity = Number(data.products[productIndex].quantity) / Number(data.products[productIndex].bundleQuantity);
         data.products[productIndex].unitPrice = (data.products[productIndex].price_raw * quantity).toFixed(2);
         for(let index = 0; index < this.orderDetails.tracking_code.rows.length; index++) {
           if(this.orderDetails.tracking_code.rows[index].product_id === data.products[productIndex].product_id) {
             data.products[productIndex].tracking = this.orderDetails.tracking_code.rows[index].tracking_id_s2s;
           }
         }
       }
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
