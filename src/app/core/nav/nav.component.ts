import { CartService } from "src/app/services/cart.service";
import { WishListService } from "src/app/core/services/wishlist.service";
import { StartupService } from "../services/startup.service";
import { Router } from "@angular/router";
import { BestSellerHttpService } from "../services/http/bestsellerhttpservice";
import { Component, OnInit, NgZone, OnChanges, ViewChild, ElementRef } from "@angular/core";
import { CategoryService } from "src/app/services/category.service";
import { Observable, Subject, fromEvent } from "rxjs";
import { SubCategoryElement } from "src/app/models/category.model";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead/typeahead-match.class";
import { ProductsService } from "src/app/services/products.service";
import { CreateOrderService } from "src/app/services/create-order.service";
import { CategoryFilterService } from "src/app/category/category-filter.service";
import { Subscription } from "rxjs";
import { AuthenticationService } from '../services/authentication.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AppAccessService } from '../services/app-access.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GoogleLoginProvider, AuthService, SocialUser } from 'angularx-social-login';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { EventsService } from '../services/events.service';
import { ProductsOverviewService } from 'src/app/products/product-overview/products.overview-service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, filter, switchMap, take } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"]
})
export class NavComponent implements OnInit {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  categoriesList: Observable<any>;
  subCategoriesList: SubCategoryElement;
  selectedCatId: string;
  loggedInUserDetails: any;
  currentUser: any;

  selectedProductName: string;
  selectedProduct;
  cartItemsCount: any;
  products: any[];
  infoData: any[];
  curr: any;
  noOfWishListLength: any;
  isSearchBar: boolean = false;
  subscription: Subscription;
  wishListcount: any;
  public pendingOrderStatus: any;
  public currentUserObj: any;
  public addToCartCount: any;
  public cartItems: any;
  public productImage: any;
  public showtoast: boolean = false;
  loginRef: BsModalRef;
  registerRef: BsModalRef;
  socialUser: SocialUser;
  isSocialUser;

  constructor(
    public catService: CategoryService,
    public catFilter: CategoryFilterService,
    public events: EventsService,
    public bestSellerHttpService: BestSellerHttpService,
    public route: Router,
    public startupService: StartupService,
    public productsService: ProductsService,
    private authService: AuthenticationService,
    public socialAuthService: AuthService,
    public co: CreateOrderService,
    public wishListService: WishListService,
    public createOrderService: CreateOrderService,
    public cartSerivce: CartService,
    private modalService: BsModalService,
    private ngZone: NgZone,
    public po: ProductsOverviewService,
    public appAccessService: AppAccessService
  ) { }
  categoryImage: string;
  myControl = new FormControl();
  menu_selectedCatId;
  isCategorySelected(id) {
    return this.menu_selectedCatId === id
  }
  init() {
    this.getInfoData();
    this.getPendingOrders();
    this.getWishListItem();
    this.cartSerivce.getCartProducts().subscribe();

    this.cartSerivce.addToCartCountSub.subscribe(res => {
      this.addToCartCount = res;
    });

    this.wishListService.whishListCountSub.subscribe(res => {
      this.wishListcount = res;
    });

    this.cartSerivce.addToCartSub.subscribe(res => {
      this.showtoast = true;
      this.cartItems = res["data"]["product"];

      setTimeout(() => {
        this.showtoast = false;
      }, 5000);
    });

    this.createOrderService.cartimage.subscribe(image => {
      this.productImage = image.image;
    });

    this.cartSerivce.cartimage.subscribe(image => {
      this.productImage = image;
    });
    this.getCartItemsCount();
    this.closeToast();
    // this.appAccessService.getCurrentUserDetails();
  }
  ngOnInit() {
    // this.selectedCatId = "85";
    this.catService.getCategories().subscribe(data => {
      this.categoriesList = data;
      this.selectedCatId = this.categoriesList["data"][0].category_id;
      this.menu_selectedCatId = this.selectedCatId
    });
    this.events.logoutEvent$.subscribe(() => {
      this.ngZone.run(() => {
        this.addToCartCount = 0;
        // this.noOfWishListLength = 0;
        this.wishListcount = 0;
        this.pendingOrderStatus = 0;
      })
    });
    this.init();
    this.events.loginEvent$.subscribe(() => {
      this.ngZone.run(() => {
        this.init();
      })
    });
  }

  slug(text) {
    return this.catService.slug(text);
  }
  onHover(e: any, type: any, catId: any) {
    this.menu_selectedCatId = catId;
  }
  resetHover(e) {
    // this.menu_selectedCatId = this.selectedCatId
  }
  onClickCategory(id) {
    this.menu_selectedCatId = id;
    this.selectedCatId = id;
    document.getElementById('megaMenu').style.display = 'none';
  }
  onItemHover(image) {
    if (image) {
      this.categoryImage = image;
    } else {
      this.categoryImage = '';
    }
  }
  catClicked(ev) {
    document.getElementById('megaMenu').style.display = 'none';
  }

  loadServices(link, title) {
    this.route.navigate(['/', 'services', link, this.catService.slug(title)]);
    document.getElementById('services').style.display = 'none';
  }
  showSearchBar() {
    this.isSearchBar = !this.isSearchBar;
  }

  removeSearchBar() {
    this.isSearchBar = false;
    this.myControl.reset();
    this.products = [];
  }
  displayFn(product): string | undefined {
    return product ? product.name : undefined;
  }
  onKeydown(ev) {
    this.selectedProduct = this.myControl.value;
    this.route.navigate(this.getLink(this.selectedProduct));
    this.removeSearchBar();
  }
  // onSelectProduct(): void {
  //   this.myControl.valueChanges.pipe(
  //     debounceTime(400),
  //     switchMap(id => {
  //     return this.productsService.searchProduct(this.myControl.value);
  //     })
  //   ).subscribe(res => this.products = res.data);
  // }
  getLink(product) {
    const productItem = product;
    if ((productItem.category !== null) && (productItem.category !== undefined)) {
      let linkArray = productItem.category.map(a => `${a.id}/${this.catService.slug(a.name)}`);
      let a = linkArray.toString();
      let b = a.replace(",", "");
      let c = decodeURI(decodeURI(decodeURI(b)));
      return ['/products', b, this.catService.slug(product.name), product.product_id];
    } else {
      return ['/products', this.catService.slug(product.name), product.product_id];
    }
  }
  closeToast() {
    this.showtoast = false;
  }
  // Load Pending orders count
  getPendingOrders() {
    this.ngZone.run(() => {
      this.bestSellerHttpService.getOrders().subscribe(res => {
        this.pendingOrderStatus = res["data"].filter(
          data => data.status === "Pending"
        );
      });
    });
  }
  // Load wishlist count
  getWishListItem() {
    this.ngZone.run(() => {
      this.wishListService.getWishListFromAPI(true).subscribe(res => {
        this.currentUser = JSON.parse(localStorage.getItem('loggedIn'))
        if ((this.currentUser !== null) && (this.currentUser !== undefined)) {
          this.noOfWishListLength = res["data"].length;
        }
      });
    });
  }

  // Cart products count
  getCartItemsCount() {
    this.cartSerivce.getCartProducts().pipe(take(1)).subscribe(e => {
      if ((e !== null) && (e !== undefined)) {
        this.cartItemsCount = e.products.length;
      } else {
        this.cartItemsCount = 0;
      }
    });
  }

  getInfoData() {
    this.ngZone.run(() => {
      this.bestSellerHttpService.getBannerAPI().subscribe(res => {
        this.infoData = res.data;
      });
    });
  }

  logoutCurr() {
    if ((localStorage.getItem('socialuser') !== null)) {
      this.socialAuthService.signOut();
      localStorage.clear();
      this.appAccessService.loggedIn = false;
    } else if (localStorage.getItem('user')) {
      this.authService.logOutCurrentUser().subscribe(
        res => {
          // localStorage.removeItem("auth");
          // localStorage.removeItem("user");
          // sessionStorage.clear();
          this.wishListcount = 0;
          this.cartItemsCount = 0;
          this.pendingOrderStatus = 0;
          this.currentUser = false;
          localStorage.clear();
          //  this.route.navigate(["/"]);
          this.startupService.getAuthToken().then(
            res => {
              //this.currentUser = null;
              // this.authService.signOut();
              this.route.navigate(["/"]);
            },
            err => {
              console.error("NavComponent -> error in getting auth token", err);
            }
          );
        },
        err => {

        }
      );
    } else {
      return;
    }
  }
  openLoginModal() {
  }
  openSignupModal() {
    // this.registerRef = this.modalService.show(SignUpComponent);
  }
}
