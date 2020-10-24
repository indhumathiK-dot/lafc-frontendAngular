import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Product } from 'src/app/models/products.model';
import { WishListService } from 'src/app/core/services/wishlist.service';
import { BestSellerHttpService } from 'src/app/core/services/http/bestsellerhttpservice';
import { BsModalService } from 'ngx-bootstrap';
import { CategoryService } from 'src/app/services/category.service';
import { CreateOrderService } from 'src/app/services/create-order.service';

@Component({
  selector: 'app-product-list-view',
  templateUrl: './product-list-view.component.html',
  styleUrls: ['./product-list-view.component.css']
})
export class ProductListViewComponent implements OnInit {
  @Input() productItem: Product;
  @Input() productCategory: { link: Array<any> };
  @Input() fromCategory: boolean;
  @Output() productDetails: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() addItemToCart: EventEmitter<Product> = new EventEmitter<Product>();
  public user: any;
  loginModalRef;
  constructor(public wishListService: WishListService,
    public modalService: BsModalService,
    public ngZone: NgZone,
    public catService: CategoryService,
    public co: CreateOrderService,
    public bestSellerHttpService: BestSellerHttpService) { }
  ngOnInit() {
    this.productItem.discountPrice = (this.productItem.price - this.productItem.special).toFixed(2);
    this.productItem.discountPercentile = ((this.productItem.discountPrice / this.productItem.price) * 100).toFixed(0);
    this.user = this.bestSellerHttpService.getCurrentUser();
    this.initWishlist();
  }

  getLink(name, productId) {
    if (this.fromCategory === true && (this.productCategory.link.length !== null) && (this.productCategory.link.length !== undefined)) {
      return ['/products', ...this.productCategory.link, this.catService.slug(name), productId];
    } else if (this.fromCategory === false) {
      if ((this.productItem.category !== null) && (this.productItem.category !== undefined)) {
        let linkArray = this.productItem.category.map(a => `${a.id}/${this.catService.slug(a.name)}`);
        let a = linkArray.toString();
        let b = a.replace(",", "");
        let c = decodeURI(decodeURI(decodeURI(b)));
        return ['/products', c, this.catService.slug(name), productId];
      } else {
        return ['/products', this.catService.slug(name), productId];
      }
    }
  }
  onClickProduct(ev) {
    this.productDetails.emit(this.productItem);
  }
  addToCart(ev: MouseEvent) {
    // ev.stopPropagation();
    // this.addItemToCart.emit(this.productItem);
    this.co.addToCart(this.productItem);
  }
  postWishListItem(product_id) {
    if (this.user) {
      if (this.productItem.isWishList) {
        this.wishListService.deleteWishList(product_id).subscribe(res => {
          this.productItem.isWishList = false;
        });
      } else {
        this.wishListService.postWishListFromAPI(product_id).subscribe(res => {
          this.productItem.isWishList = true;
        });
      }
    }
  }
  initWishlist() {
    this.ngZone.run(() => {
      this.wishListService.getWishListFromAPI().subscribe(res => {
        this.productItem.isWishList = this.wishListService.isWishListed(this.productItem.product_id);
      });
    });
  }
  getAttributeByGroupName(attrName: string) {
    let prod = this.productItem;
    if (!prod) {
      return null;
    }
    let attrGroups = prod.attribute_groups;
    return attrGroups.find(attr => attr.name === attrName);
  }
  getAttributeByName(groupName: string, attrName: string) {
    const tags = this.getAttributeByGroupName(groupName);
    if (!tags) {
      return null;
    }
    return tags.attribute.find(attr => attr.name === attrName);
  };

}
