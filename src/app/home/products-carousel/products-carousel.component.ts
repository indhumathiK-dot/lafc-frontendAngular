import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";


import {map, take} from "rxjs/operators";
import { BestSellerHttpService } from '../../core/services/http/bestsellerhttpservice';
import {ProductQuickViewComponent} from "../../products/product-quick-view/product-quick-view.component";
import {BsModalService} from "ngx-bootstrap";
import {WishListService} from "../../core/services/wishlist.service";
import {Router} from "@angular/router";



@Component({
  selector: "app-products-carousel",
  templateUrl: "./products-carousel.component.html",
  styleUrls: ["./products-carousel.component.css"]
})
export class ProductsCarouselComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() productList: any[] = [];
  @Input() productId: any[] = [];
  public wishListPresent: any;
  @Output() selectedProduct: EventEmitter<any> = new EventEmitter<any>();
  public loginCheck: boolean;

  constructor(public modalService: BsModalService,
              private wishListService: WishListService,
              private router: Router) {}

  ngOnInit() {
    this.loginCheck = localStorage.getItem('loggedIn') === 'true';
  }

  productClicked(product){
    this.selectedProduct.emit(product);
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

  customOptions: any = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    autoHeight: true,
    autoWidth:true,
    navText: [ '<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>' ],
    navClass: [],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 3
      },
      740: {
        items: 2
      },
      940: {
        items: 5
      }
    },
    nav: true
  };

  openQuickView(value) {
    sessionStorage.setItem('productId', value);
    var loginModalRef = this.modalService.show(ProductQuickViewComponent);
  }

  detailRedirect(url: string) {
    this.router.navigateByUrl(url);
  }
}
