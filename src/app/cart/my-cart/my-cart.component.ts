import { take } from 'rxjs/internal/operators';
import { Component, OnInit } from '@angular/core';
import { ICartData } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.css']
})
export class itemsComponent implements OnInit {

  displayedColumns = ['Product', 'Desc', 'Price', 'Quantity', 'Total'];
  dataSource = new MatTableDataSource<any>();
  public cartDetails: ICartData;
  updateCartArray = [];
  firstLoadCheck: boolean = false;

  constructor(private cartSerivce: CartService,
              private router: Router) { }

  ngOnInit() {
    this.getCartItems();
  }

  getCartItems() {
    this.cartSerivce.getCartBundleProducts().pipe(take(1)).subscribe(e => {
      this.firstLoadCheck = true;
      if ((e !== null) && (e !== undefined)) {
        if(e['length'] === 0) {
          this.dataSource.data = [];
        } else {
          this.cartDetails = e;
          var productsList = [];
          for(let i=0; i< e.products.length; i++) {
            if(e.products[i].thumb.includes('no_image')) {
              e.products[i]['imageCheck'] = false;
              productsList.push(e.products[i]);
            } else {
              e.products[i]['imageCheck'] = true;
              productsList.push(e.products[i]);
            }
          }
          this.dataSource.data = e['length'] === 0 ? [] : productsList;
        }

      } else {
        this.dataSource.data = [];
      }
    });
  }

  removeCartItem(key) {
    var removeCheck = confirm('Are you sure you want to remove this item? ');
    if(removeCheck) {
      var data = {
        key: key
      }
      this.cartSerivce.deleteCartProduct(key).pipe(take(1)).
      subscribe(e => {
        this.cartSerivce.addToCartCountSub.next();
        this.getCartItems();
      });
    }

  }

  updateCart() {
    for(let index = 0; index < this.updateCartArray.length; index++) {
      this.cartSerivce.updateProductQuantity(this.updateCartArray[index]).pipe(take(1)).subscribe(e => {
        this.getCartItems();
      });
    }
  }

  quantityUpdate(value: any, element: any) {

        var cartData;
        var cartExists = this.updateCartArray.some(function (el, index) {
          if (el.key === element.key.toString()) {
            cartData = {index: index, value: el};
          }
          return el.key === element.key.toString()
        });
        if (cartExists) {
          this.updateCartArray.splice(cartData.index, 1);
          this.updateCartArray.push({
            "key": element['key'],
            "quantity": Number(value) * Number(element.singleBundleQuantity)
          })
        } else {
          var quantityData = {
            "key": element['key'],
            "quantity": Number(value) * Number(element.singleBundleQuantity)
          }
          this.updateCartArray.push(quantityData);
        }
  }
}
