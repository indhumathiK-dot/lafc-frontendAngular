import { Component, OnInit } from "@angular/core";
import {take} from "rxjs/operators";
import {WishListService} from "../../../core/services/wishlist.service";
import {CartService} from "../../../services/cart.service";
import {ProductsService} from "../../../services/products.service";

@Component({
  selector: "app-wishlist",
  templateUrl: "./wishlist.component.html",
  styleUrls: ["./wishlist.component.css"]
})
export class WishlistComponent implements OnInit {
  public wishlist: [];
  firstLoadCheck: boolean = false;

  constructor(private wishlistService: WishListService,
              private cartService: CartService,
              private productsService: ProductsService) { }

  ngOnInit() {
    this.getWishList();
  }

  getWishList() {
    this.wishlistService.getBundleWishListFromAPI().pipe(take(1))
      .subscribe((res) => {
        this.firstLoadCheck = true;
        this.wishlist = res['data'];
      });
  }

  addTocart(value) {
    this.productsService.getProductById(value.product_id).pipe(take(1))
      .subscribe((products) => {
        var productsDetails = products;
        var options = {};

        productsDetails.options.forEach(function (element) {
          var key = element.product_option_id;
          options[key] = element.option_value[0].product_option_value_id
        })

        var data = {
          "product_id": value.product_id,
          "quantity": '1',
          "option": options
        }
        this.cartService.addProductToCart(data, '').pipe(take(1)).subscribe(e => {
          this.cartService.addToCartCountSub.next();
          this.removeFromWishlist(value.product_id)
        }, (error) => {
        });
      });
  }

  removeFromWishlist(productId) {
    this.wishlistService.deleteWishList(productId).subscribe(res => {
      this.getWishList();
      this.wishlistService.whishListCountSub.next();
    });
  }

}
