import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import * as $ from "jquery";
import {Router} from "@angular/router";
import {CategoryFilterService} from "../../category/category-filter.service";
import {EventsService} from "../services/events.service";
import {AuthenticationService} from "../services/authentication.service";
import {StartupService} from "../services/startup.service";
import {take} from "rxjs/operators";
import {CartService} from "../../services/cart.service";
import {WishListService} from "../services/wishlist.service";
import {informationServices} from "../../home/information/information.service";
import {MediaMatcher} from "@angular/cdk/layout";
import {BestSellerHttpService} from "../services/http/bestsellerhttpservice";

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {
  public categoriesList = [];
  public subCategoryList = [];
  public customerName = '';
  public cartItemsCount: number = 0;
  public wishlistCount: number = 0;
  public aboutMenu = [];
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  public brands = [];

  constructor(private router: Router,
              private events: EventsService,
              private categoryFilterService:CategoryFilterService,
              private authenticationService: AuthenticationService,
              private startupService: StartupService,
              private cartSerivce: CartService,
              private wishListService: WishListService,
              private informationServices: informationServices,
              private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher,
              private bestsellerhttpservice: BestSellerHttpService) {
    this.initilaStup();
    this.intSetup();
    this.events.loginEvent$.subscribe(() => {
      let user = localStorage.getItem('user');
      user = JSON.parse(user);
      this.customerName = user['firstname'] + ' ' + user['lastname'];
    });

    this.cartSerivce.addToCartCountSub.subscribe(res => {
      this.getCartItemsCount();
    });

    this.wishListService.whishListCountSub.subscribe(res => {
      this.getWishList();
    });
  }

  ngOnInit() {
    this.getCartItemsCount();
    this.getWishList();
    this.getBrands();
    this.getInformationAPI();
    if(localStorage.getItem('loggedIn') === 'true') {
      let user = localStorage.getItem('user');
      user = JSON.parse(user);
      this.customerName = user['firstname'] + ' ' + user['lastname'];
    }
    this.categoriesList = this.categoryFilterService.tree.children;
  }

  intSetup(): void {
    this.mobileQuery = this.media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  initilaStup(): void {
    this.mobileQuery = this.media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    const setupDone = localStorage.getItem('setup');
  }

  //get wishlist count
  getWishList() {
    this.wishListService.getWishListFromAPI().pipe(take(1))
      .subscribe((res) => {
        this.wishlistCount = res['data'].length;
      });
  }

  // Cart products count
  getCartItemsCount() {
    this.cartSerivce.getCartProducts().pipe(take(1)).subscribe(e => {
      if ((e !== null) && (e !== undefined)) {
        this.cartItemsCount = e.products ? e.products.length : 0
      } else {
        this.cartItemsCount = 0;
      }
    });
  }

  getBrands() {
    this.bestsellerhttpservice.getAllBrands().subscribe(res => {
      this.brands = res.data;
    });
  }

  getInformationAPI() {
    this.informationServices.getInfo().subscribe(res => {
      this.aboutMenu = res.data;
      this.aboutMenu.push({title: 'Contact-Us',id: 1})
    });
  }

  hoverMenu(subCategory) {
      if (subCategory.length) {
        this.subCategoryList = subCategory;
        $("#tier2-1").addClass("fd-pushleft");
        $(".fd-arrow-left").addClass("fd-showoff");
      } else {
        $(".fd-arrow-left").removeClass("fd-showoff");
        $("#tier2-1").removeClass("fd-pushleft");
      }
  }
  hoverLeave(subCategory){
      if (subCategory.length) {
        this.subCategoryList = [];
        $(".fd-arrow-left").removeClass("fd-showoff");
        $("#tier2-1").removeClass("fd-pushleft");
      }
  }

  navigate() {
    this.router.navigate(['/account/wishlist']);
  }

  subHoverMenu() {
    $("#tier2-1").addClass("fd-pushleft");
    $(".fd-arrow-left").addClass("fd-showoff");
  }

  subHoverLeave() {
    $(".fd-arrow-left").removeClass("fd-showoff");
    $("#tier2-1").removeClass("fd-pushleft");
  }

  userLogout() {
    this.authenticationService.logOutCurrentUser().subscribe(
       res => {
         var imageDimesion = localStorage.getItem('image-dimension');
       localStorage.clear();
       localStorage.setItem('image-dimension', imageDimesion);
       this.startupService.getAuthToken().then(
        res => {
          this.customerName = '';
          this.events.logoutEvent$.emit(true);
          this.router.navigateByUrl("/").then(() => {
            window.location.reload();
          });
          });
     });
  }

  loginNavidate(url) {
    if(this.customerName) {
      this.router.navigate([url]);
    } else {
      this.router.navigate(['/login'])
    }
  }

}
