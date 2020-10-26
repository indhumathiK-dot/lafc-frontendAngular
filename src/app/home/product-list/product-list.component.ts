import {Component, Input, OnInit} from '@angular/core';
import {ProductQuickViewComponent} from "../../products/product-quick-view/product-quick-view.component";
import {BsModalService} from "ngx-bootstrap";
import {WishListService} from "../../core/services/wishlist.service";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  @Input() productList: any[] = [];
  public loginCheck: string;
  public wishListPresent: any;
  public over = [];

  constructor(public modalService: BsModalService,
              private wishListService: WishListService) { }

  ngOnInit() {
    // for(let i=0; i< this.productList.length; i++) {
    //   if(this.productList[i].thumb) {
    //     if(this.productList[i].thumb.includes('no_image')) {
    //       this.productList[i]['imageCheck'] = false;
    //       this.productList.push(this.productList);
    //     } else {
    //       this.productList[i]['imageCheck'] = true;
    //       this.productList.push(this.productList[i]);
    //     }
    //   } else {
    //     if(this.productList[i].image.includes('no_image')) {
    //       this.productList[i]['imageCheck'] = false;
    //       this.productList.push(this.productList);
    //     } else {
    //       this.productList[i]['imageCheck'] = true;
    //       this.productList.push(this.productList[i]);
    //     }
    //   }
    //
    // }
    this.over = new Array(this.productList.length);
    this.over.fill(false);
    this.loginCheck = localStorage.getItem('loggedIn');
  }

  openQuickView(value) {
    sessionStorage.setItem('productId', value);
    const initialState = {productList: this.productList};
    var loginModalRef = this.modalService.show(ProductQuickViewComponent, Object.assign({}, { class: 'modal-sm quick-width-adjust', initialState })
    );
  }

  addWishList(productId) {
    this.wishListService.postWishListFromAPI(productId).subscribe(res => {
      this.wishListService.whishListCountSub.next();
      this.wishListPresent = true;
    });
  }

  wishlistCheck(productId: any) {
    this.wishListService.getWishListFromAPI().pipe(take(1))
      .subscribe((res) => {
        var wishlist = res['data'];
        this.wishListPresent = wishlist.some(function(el){ return el.product_id === productId.toString()});
      });
  }

  hover(index) {
   this.over[index] = true;
  }

  unhover(index) {
    this.over[index] = false;
  }
}
