import { Component, OnInit } from '@angular/core';
import { MyOrdersService } from 'src/app/services/my-orders.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PageChangedEvent } from 'ngx-bootstrap/pagination/ngx-bootstrap-pagination';
import {MatTableDataSource} from "@angular/material/table";
import {BestSellerHttpService} from "../../../core/services/http/bestsellerhttpservice";
import {take} from "rxjs/operators";
import {OrdersService} from "../../../services/orders.service";

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  displayedColumns = ['Order No', 'Date', 'Payment Status', 'Total'];
  dataSource = new MatTableDataSource<any>();
  customerDetails: {};
  public address = [];
  public defaultAddress: {};

  constructor(private bestSellerHttpService: BestSellerHttpService,
              private ordersService: OrdersService,
              private router: Router) {
  }

  ngOnInit() {
    let user = localStorage.getItem('user');
    this.customerDetails = JSON.parse(user);
    this.addressList();
    this.myOrderList();
  }

  myOrderList() {
    this.ordersService.getCustomersOrders(10000, 1).subscribe(
      data => {
        this.dataSource.data = data;
      });
  }

  addressList() {
    this.bestSellerHttpService.getAddress().pipe(take(1))
      .subscribe((res) => {
        this.address = res['data'].addresses;
        for(let i = 0; i < this.address.length; i++) {
          if(this.address[i].default === true) {
            this.defaultAddress = this.address[i];
          }
        }
      });
  }

  addressNavigate() {
    this.bestSellerHttpService.addressUpdate.next(true);
    this.router.navigate(['/account/address']);
  }
}
