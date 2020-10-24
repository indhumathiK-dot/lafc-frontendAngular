import {Component, ElementRef, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs/operators";
import {ProductsService} from "../../services/products.service";
import {CartService} from "../../services/cart.service";
import {WishListService} from "../../core/services/wishlist.service";
import {animate, keyframes, state, style, transition, trigger} from "@angular/animations";
import {ProductQuickViewComponent} from "../product-quick-view/product-quick-view.component";
import {BsModalService} from "ngx-bootstrap";
import {ImageViewComponent} from "../image-view/image-view.component";
import Swiper from 'swiper';

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"]
})
export class ProductDetailsComponent implements OnInit {
  Swiper: any;
  productId;
  public slideIndex = 1;
  public optionList = [];
  public productsDetails: any;
  public productImages = [];
  public loginCheck: boolean;
  selectedOptionList = [];
  private quantity = 1;
  public wishlistUpdate = false;
  public backname: any;
  public relatedProducts: any;
  public cartLabel = 'Add to cart';
  public products: [];
  public selectedProductIndex;
  previousIndexCheck;
  nextIndexCheck;
  private category: any;
  public fbName: any;
  public imagesList = [];
  carouselOptions: any = {items: 3, dots: true, navigation: false};

  constructor(private route: ActivatedRoute,
              private productsService: ProductsService,
              private cartService: CartService,
              private router: Router,
              private wishListService: WishListService,
              public modalService: BsModalService,
              public elementRef: ElementRef) {
    this.loginCheck = localStorage.getItem('loggedIn') === 'true';
    this.route.params.subscribe(params => {
      this.productId = params['product_id'];
      this.category = params['name'];
      this.backname = params['name'] ? params['name'] : 'New Arrivals';
      this.loadInit();
    });
  }

  ngOnInit() {

  }

  loadInit() {
    this.productImages = [];
    this.optionList = [];
    this.selectedOptionList = [];
    this.selectedProductIndex = this.productId;
    this.getWishList();
    this.getProductDetails(this.productId);
    this.getRelatedProducts(this.productId);
    this.getProductList();
    this.getImageArray(this.productId);
  }

  ngAfterViewInit() {
    var galleryTop = new Swiper('.gallery-top', {
        observer: true,
  observeParents: true,
        spaceBetween: 234,
        centeredSlides: true,
        slidesPerView: 3,
          navigation: {
            nextEl: '.swiper-button-n',
            prevEl: '.swiper-button-p',
          },
            loop: true,
            loopedSlides: 3,
            breakpoints:{
               // when window width is >= 320px
    320: {
      slidesPerView: 2,
      spaceBetween: 200
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 1,
      spaceBetween: 30
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 2,
      spaceBetween: 225
    },
    1659: {
      slidesPerView: 3,
      spaceBetween: 250
    },
    1080: {
      slidesPerView: 2,
      spaceBetween: 230
    },
    900: {
      slidesPerView: 3,
      spaceBetween: 234
    },
            }
    });
    var galleryThumbs = new Swiper('.gallery-thumbs', {
      observer: true,
       observeParents: true,
      spaceBetween: 3,
      centeredSlides: true,

      slidesPerView: 'auto',
      touchRatio: 0.2,
      slideToClickedSlide: true,
			loop: true,
      loopedSlides: 3,
      breakpoints:{
        // when window width is >= 320px
320: {
slidesPerView: 2,
spaceBetween: 5
},
900: {
  slidesPerView: 3,
  spaceBetween: 3
  },}
    });
    galleryTop.controller.control = galleryThumbs;
    galleryThumbs.controller.control = galleryTop;
  }
  getProductList() {
    this.productsService.getAllProducts().pipe(take(1))
      .subscribe((products) => {
        this.products = products;
        for(let index = 0; index < this.products.length; index++) {
          if(this.products[index]['product_id'] == this.productId) {

            if(index === 0) {
              this.previousIndexCheck = false;
              this.nextIndexCheck = true;
            } else if(index === this.products.length -1) {
              this.nextIndexCheck = false;
              this.previousIndexCheck = true;
            } else {
              this.previousIndexCheck = true;
              this.nextIndexCheck = true;
            }
            this.selectedProductIndex = this.products[index]['product_id'];
          }
        }
      });
  }

  getProductDetails(productId) {
    this.productsService.getBundleProductById(productId).pipe(take(1))
      .subscribe((products) => {
        this.productsDetails = products;
        this.fbName = this.productsDetails.name.replaceAll(' ', '-');
        this.productImages.push(this.productsDetails.image);
        this.productImages.push(this.productsDetails.image);
        this.productImages.push(this.productsDetails.image);
        for(let i = 0; i < this.productsDetails.images.length; i++) {
          this.productImages.push(this.productsDetails.images[i]);
        }

this.navigate();

        for(let index = 0; index < this.productsDetails.options.length; index++) {
          var optionList = [];
          for(let value = 0; value < this.productsDetails.options[index].option_value.length; value++) {
            if(index == 0) {
              this.selectedOptionList.push({
                optionId: this.productsDetails.options[index].product_option_id,
                valueId: this.productsDetails.options[index].option_value[value].product_option_value_id
              })
            }
            optionList.push({
              value: this.productsDetails.options[index].option_value[value].product_option_value_id,
              label: this.productsDetails.options[index].option_value[value].name
            })
          }
          this.optionList.push({
            name: this.productsDetails.options[index].name,
            option_value: optionList
          })
        }

        setTimeout(() => {
          this.showDivs(this.slideIndex);
        }, 500);
      });
  }

  getImageArray(productId) {
    this.productsService.getProductById(productId).pipe(take(1))
      .subscribe((products) => {
        this.imagesList.push(products.image);
        for(let i = 0; i < products.images.length; i++) {
          this.imagesList.push(products.images[i]);
        }
      });
  }

  getRelatedProducts(productId) {
    this.productsService.getRelatedBundleProductById(productId).pipe(take(1))
      .subscribe((products) => {
        this.relatedProducts = products;
      });
  }

  getWishList() {
    this.wishListService.getWishListFromAPI().pipe(take(1))
      .subscribe((res) => {
        this.wishlistUpdate = res['data'].some(wish => wish.product_id === this.productId);
      });
  }

  plusDivs(n) {
    this.showDivs(this.slideIndex += n);
  }

  showDivs(n) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    if (n > x.length) {this.slideIndex = 1}
    if (n < 1) {this.slideIndex = x.length}
    for (i = 0; i < x.length; i++) {
      x[i]['style'].display = "none";
    }
    x[this.slideIndex-1]['style'].display = "block";
  }

  optionSelect(option: any, value: any) {
    if(this.selectedOptionList.length) {
      this.selectedOptionList = this.selectedOptionList.filter(function( obj ) {
        return obj.optionId !== option.product_option_id;
      });

      this.selectedOptionList.push({
        optionId: option.product_option_id,
        valueId: value
      })
    } else {
      this.selectedOptionList.push({
        optionId: option.product_option_id,
        valueId: value
      })
    }
  }

  quantityUpdate(value: any) {
    this.quantity = value;
  }

  addTocart(type, productId) {
    this.cartLabel = 'Adding';
    this.cartService.getCartProducts().pipe(take(1))
      .subscribe((res) => {
        var cartlist = res['products'] ? res['products'] : [];
        var cartData = {};
        var cartListPresent = cartlist.some(function (el) {
          if(el.product_id === productId.toString()) {
            cartData = el;
          }
          return el.product_id === productId.toString()
        });
        if(cartListPresent) {
          var quantityData = {
            "key": cartData['key'],
            "quantity": Number(cartData['quantity']) + Number(this.quantity * this.productsDetails.bundle_quantity)
          }
          this.cartService.updateProductQuantity(quantityData).pipe(take(1)).subscribe(e => {
            this.cartLabel = 'Added to cart';
            if (type === 'buy') {
              this.router.navigate(['/cart/delivery']);
            }
          }, (error) => {
          });
        } else {
          var options = {};
          this.selectedOptionList.forEach(function (element) {
            var key = element.optionId.toString();
            options[key] = element.valueId
          })
          var data = {
            "product_id": this.productId,
            "quantity": (this.quantity * this.productsDetails.bundle_quantity ).toString(),
            "option": options
          }
          this.cartService.addProductToCart(data, '').pipe(take(1)).subscribe(e => {
            this.cartLabel = 'Added to cart';
            this.cartService.addToCartCountSub.next();
            if (type === 'buy') {
              this.router.navigate(['/cart/delivery']);
            }
          }, (error) => {
          });
        }
      });
  }

  addWishList() {
    this.wishListService.postWishListFromAPI(this.productId).subscribe(res => {
      this.wishlistUpdate = true;
      this.wishListService.whishListCountSub.next();
    });
  }

  quantityValidation() {
    var ageInput = document.getElementById("quantity")

    ageInput.addEventListener("keydown", function(e) {
      // prevent: "e", "=", ",", "-", "."
      if ([69, 187, 188, 189, 190, 48, 96].includes(e.keyCode)) {
        e.preventDefault();
      }
    })
  }

  previousProduct() {
    for(let index = 0; index < this.products.length; index++) {
      if(this.products[index]['product_id'] == this.productId) {
        this.selectedProductIndex = this.products[index-1]['product_id'];
        this.productId = this.products[index-1]['product_id'];
        var category = this.products[index-1]['category'][0]['name'];
        this.router.navigate(['/products/' + category + '/' + this.productId]);
        this.loadInit();
        return
      }
    }
  }

  nextProduct() {
    for(let index = 0; index < this.products.length; index++) {
      if(this.products[index]['product_id'] == this.productId) {
        this.selectedProductIndex = this.products[index+1]['product_id'];
        this.productId = this.products[index+1]['product_id'];
        var category = this.products[index-1]['category'][0]['name'];
        this.router.navigate(['/products/' + category + '/' + this.productId]);
        this.loadInit();
        return
      }
    }
  }


  imageView(index) {
    const initialState = {imagesArray: this.imagesList, currentImage: index};
    var loginModalRef = this.modalService.show(ImageViewComponent, Object.assign({}, { class: 'modal-sm', initialState }));
  }

    backRedirection(backname: any) {
        if(backname === 'New Arrivals') {
            this.router.navigate(['/collections/new-arrival/New Arrival'])
        } else {
            this.router.navigate(['/products/collections/' + this.productsDetails.category[0].name + '/' + this.productsDetails.category[0].id])
        }
    }

    imageNavigate() {

    }


    navigate() {

    }
}
