import { Injectable, NgZone } from '@angular/core';
import { OrdersService } from './orders.service';

@Injectable({
  providedIn: 'root'
})
export class MyOrdersService {
  public ordersList;
  public filteredList;
  public returnedOrdersArray;
  public orderDetails;
  public ordId;
  public reorderDetails;
  public reOrdered = false;
  constructor(public ordersService: OrdersService, private ngZone: NgZone) { }
  loadMyOrders() {
    this.ngZone.run(() => {
      this.ordersService.getCustomersOrders(10000, 1).subscribe(
        data => {
          this.ordersList = data;
          this.filteredList = this.ordersList;
          this.returnedOrdersArray = this.filteredList.slice(0, 10);
          if ((this.ordersList !== null) && (this.ordersList !== undefined)) {
            this.ordersList.sort((a, b) => (a.status.toLowerCase() < b.status.toLowerCase()) ? 1 : ((b.status.toLowerCase() < a.status.toLowerCase()) ? -1 : 0));
          }
        }
      );
    });
  }
  getOrderDetails(id) {
    this.ngZone.run(() => {
      this.ordersService.getCustomerOrdersDetailsById(id).subscribe(
        data => {
          this.orderDetails = data;
        }
      );
    });
  }
  reorderProductById(order_id, order_product_id) {
    this.ordersService.reOrderProductById(order_id, order_product_id).subscribe(
      data => {
        if (data.success === 1) {
          this.reorderDetails = data;
          this.reOrdered = !this.reOrdered;
        }
      }
    );
  }
  filterChoosen(ev) {
    var today = new Date();
    var sixMonths = new Date();
    sixMonths.setDate(today.getDate() - 180);
    var val1 = sixMonths.getDate() + '/' + sixMonths.getMonth() + 1 + '/' + sixMonths.getFullYear();
    var oneYear = new Date();
    oneYear.setDate(today.getDate() - 365);
    var val2 = oneYear.getDate() + '/' + oneYear.getMonth() + 1 + '/' + oneYear.getFullYear();
    if (ev === 'sixMonths') {
      this.filteredList = this.ordersList.filter(e => {
        return e.date_added < val1;
      });
    } else if (ev === 'oneYear') {
      this.filteredList = this.ordersList.filter(e => {
        return e.date_added < val2;
      });
    } else {
      this.filteredList = this.ordersList;
    }
  }
}
