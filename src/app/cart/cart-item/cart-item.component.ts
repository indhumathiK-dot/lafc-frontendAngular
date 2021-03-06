import { Component } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {take} from "rxjs/internal/operators";
import {CartService} from "../../services/cart.service";
import {OrdersService} from "../../services/orders.service";

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {

  displayedColumns = ['productImage', 'description', 'Total'];
  dataSource = new MatTableDataSource<any>();
  public shiipingInfo: string;
  public subTotal: string;
  public total: string;
  public cartDetails;
  public orderDetails: any;
  public totalArray: any[];

  constructor(private router: Router,
              private cartSerivce: CartService,
              private ordersService: OrdersService) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
    });
    this.shiipingInfo = 'Calculated Later';
    this.getCartItems();
  }

  getCartItems() {
    if(this.router.url === '/cart/orderSuccess') {
      var orderId = sessionStorage.getItem('orderId');
      // var orderId = 77;
      this.ordersService.getCustomerOrdersDetailsWithTrackingById(orderId).subscribe(
        data => {
          this.orderDetails = data;
          this.dataSource.data = data.products;
          var totalValue = [];
          for(let index = 0; index < this.orderDetails.totals.length; index++) {
            var value = this.orderDetails.currency.symbol_left + Number(this.orderDetails.totals[index].value).toFixed(this.orderDetails.currency.decimal_place) + this.orderDetails.currency.symbol_right;
            totalValue.push({title : this.orderDetails.totals[index].title, text: value});
            this.totalArray = totalValue;
          }
        }
      );
    } else {
      this.cartSerivce.getCartBundleProducts().pipe(take(1)).subscribe(e => {
        if ((e !== null) && (e !== undefined)) {
          this.cartDetails = e;
          this.totalArray = this.cartDetails.totals;
          for (let index = 0; index < e.totals.length; index++) {
            if (e.totals[index]['title'] == 'Sub-Total') {
              this.subTotal = e.totals[index]['text']
            } else if (e.totals[index]['title'] == 'Total') {
              this.total = e.totals[index]['text'];
            }
          }
          this.dataSource.data = e.products;
        } else {
          this.dataSource.data = [];
        }
      });
    }
  }

}
