import { take } from 'rxjs/internal/operators';
import { Component, OnInit } from '@angular/core';
import { ICartData } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {ErrorComponentComponent} from "../../core/error-component/error-component.component";
import {BsModalService} from "ngx-bootstrap";

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
              private router: Router,
              public modalService: BsModalService) {
    this.cartSerivce.cartListUpdate.subscribe(value => {
      if(value) {
        this.cartSerivce.cartListUpdate.next(false);
        this.getCartItems();
      }

    });
  }

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
          this.dataSource.data = e['length'] === 0 ? [] : e.products;
        }

      } else {
        this.dataSource.data = [];
      }
    });
  }

  removeCartItem(key) {
    var data = {
          key: key
        }
    this.errorUpdate(data);
    // var removeCheck = confirm('Are you sure you want to remove this item? ');
    // if(removeCheck) {
    //   var data = {
    //     key: key
    //   }
    //   this.cartSerivce.deleteCartProduct(key).pipe(take(1)).
    //   subscribe(e => {
    //     this.cartSerivce.addToCartCountSub.next();
    //     this.getCartItems();
    //   });
    // }

  }

  updateCart() {
    for(let index = 0; index < this.updateCartArray.length; index++) {
      this.cartSerivce.updateProductQuantity(this.updateCartArray[index]).pipe(take(1)).subscribe(e => {
        this.getCartItems();
      });
    }
  }

  quantityUpdate(value: any, element: any, index) {
    if(value.target.value === '0') {
      value.target.value = element.cartBundleQuantity;
    } else {
      if ([69, 187, 188, 189, 190, 109, 107, 110].includes(Number(value.keyCode))) {
        value.target.value = 0;
        value.target.value = element.cartBundleQuantity;
      } else {
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
            "quantity": Number(value.target.value) * Number(element.singleBundleQuantity)
          })
        } else {
          var quantityData = {
            "key": element['key'],
            "quantity": Number(value.target.value) * Number(element.singleBundleQuantity)
          }
          this.updateCartArray.push(quantityData);
        }
      }
    }

  }

  errorUpdate(cart) {
    var data = {
      title: 'Cart',
      message: 'Are you sure you want to remove this item?',
      type: 'confirm',
      data: cart
    }
    const initialState = {data: data};
    var loginModalRef = this.modalService.show(ErrorComponentComponent, Object.assign({}, { class: 'modal-md modal-dialog-centered', initialState }));
    this.getCartItems();
  }
}
