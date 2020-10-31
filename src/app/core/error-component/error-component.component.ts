import { Component, OnInit } from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";
import {Router} from "@angular/router";
import {CartService} from "../../services/cart.service";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-error-component',
  templateUrl: './error-component.component.html',
  styleUrls: ['./error-component.component.css']
})
export class ErrorComponentComponent implements OnInit {
  data;

  constructor(private bsModalRef: BsModalRef,
              private router: Router,
              private cartSerivce: CartService) { }

  ngOnInit() {
    setTimeout(() => {
      this.data = this.bsModalRef.content.data ;
    }, 200);
  }
  onClickContinue() {

  }
  close() {
    this.bsModalRef.hide();
  }
  onClickCancel() {
    this.bsModalRef.hide();
    if(this.data.url) {
      this.router.navigate([this.data.url]);
    }
  }

  removeItem() {
    var value = {
      key: this.data.data['key']
    }
      this.cartSerivce.deleteCartProduct(this.data.data['key']).pipe(take(1)).
      subscribe(e => {
        this.bsModalRef.hide();
        this.cartSerivce.addToCartCountSub.next();
        this.cartSerivce.cartListUpdate.next(true);
      });
    }
}
