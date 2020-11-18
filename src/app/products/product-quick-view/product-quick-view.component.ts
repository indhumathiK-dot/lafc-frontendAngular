import {Component, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {take} from "rxjs/operators";
import {ProductsService} from "../../services/products.service";
import {CartService} from "../../services/cart.service";
import {BestSellerHttpService} from "../../core/services/http/bestsellerhttpservice";
import {WishListService} from "../../core/services/wishlist.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-product-quick-view',
  templateUrl: './product-quick-view.component.html',
  styleUrls: ['./product-quick-view.component.css']
})
export class ProductQuickViewComponent implements OnInit {
public slideIndex = 1;
  productId;
  variableForm: FormGroup;
  public productsDetails: any;
  public productImages = [];
  public optionList = [];
  public loginCheck;
  selectedOptionList = [];
  private quantity = 1;
  cartLabel = 'Add to cart';
  public products: [];
  public selectedProductIndex;
  previousIndexCheck;
  nextIndexCheck;
  public fbName: any;
  private type: any;
  public productTotal: any;
  public env: string;

  constructor(private bsModalRef: BsModalRef,
              private router: Router,
              private fb: FormBuilder,
              private productsService: ProductsService,
              private cartService: CartService,
              private wishlistService: WishListService) {
    this.env = environment.frontend_url;
    this.loginCheck = localStorage.getItem('loggedIn') === 'true';
    this.productId = sessionStorage.getItem('productId');
    // console.log(this.bsModalRef)
  }

  ngOnInit() {
    this.productImages = [];
    this.optionList = [];
    this.selectedOptionList = [];
    this.selectedProductIndex = this.productId;
    this.getConfigDetails();
    this.getProductDetails(this.productId);
  }

  getConfigDetails() {
    this.variableForm = this.fb.group({
      quantity: [""]
    });
  }

  getProductDetails(productId) {
    this.productsService.getBundleProductById(productId).pipe(take(1))
      .subscribe((products) => {
        this.productsDetails = products;
        this.fbName = this.productsDetails.name.replaceAll(' ', '-');
        this.products = this.bsModalRef["content"].productList;
        this.type = this.bsModalRef["content"].type;
        this.productMove();
        this.productImages.push(this.productsDetails.image);
        for(let i = 0; i < this.productsDetails.images.length; i++) {
          this.productImages.push(this.productsDetails.images[i]);
        }

        this.productTotal = this.productsDetails.bundle_price_without_format.toFixed(2);
        for(let index = 0; index < this.productsDetails.options.length; index++) {
          var optionList = [];
          if(this.productsDetails.options[index].option_value.length) {
          for(let value = 0; value < this.productsDetails.options[index].option_value.length; value++) {
            if(value == 0) {
              this.productTotal = Number(this.productTotal) + (Number(this.productsDetails.options[index].option_value[value].price * this.productsDetails.bundle_quantity));
              this.selectedOptionList.push({
                optionId: this.productsDetails.options[index].product_option_id,
                valueId: this.productsDetails.options[index].option_value[value].product_option_value_id
              })
            }
            optionList.push({
              value: this.productsDetails.options[index].option_value[value].product_option_value_id,
              label: this.productsDetails.options[index].option_value[value].name,
              optionId: this.productsDetails.options[index].product_option_id,
              amount: this.productsDetails.options[index].option_value[value].price
            })
          }
          this.optionList.push({
            name: this.productsDetails.options[index].name,
            option_value: optionList
          })
          } else {
            this.optionList = [];
          }
        }
        setTimeout(() => {
          this.showDivs(this.slideIndex);
        }, 200);

        console.log(products)
      });
  }

  productMove() {
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
  }

  hideModal() {
    this.bsModalRef.hide();
  }

  selectImage(n) {
    this.slideIndex = n;
    this.showDivs(n);
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

  showDetails(type) {
    this.hideModal();
    if(type === 'register') {
      this.router.navigate(['/signup']);
    } else {
      if (this.productsDetails.category.length) {
        this.router.navigate(['products/' + this.productsDetails.category[0].name + '/' + this.productId]);
      } else {
        this.router.navigate(['products/' + this.productId]);
      }
    }


  }


  optionSelect(option: any, value: any) {
    this.selectedOptionList = [];
    var optionId;
    let amount;
    option.option_value.forEach(function (element) {
      if(value === element.value) {
        optionId = element.optionId;
        amount = element.amount;
      }
    })
    this.productTotal = Number(this.productsDetails.bundle_price_without_format.toFixed(2)) +  (Number(amount) * this.productsDetails.bundle_quantity);
    this.selectedOptionList.push({
      optionId: optionId,
      valueId: value
    })
  }

  quantityUpdate(value: any) {
    this.quantity = value;
  }

  addTocart(productId) {
    this.cartLabel = 'Adding';

    var options = {};
    this.selectedOptionList.forEach(function (element) {
      var key = element.optionId.toString();
      options[key] = element.valueId
    })
    var data = {
      "product_id": this.productId,
      "quantity": (this.quantity * this.productsDetails.bundle_quantity).toString(),
      "option": options
    }
    this.cartService.addProductToCart(data, '').pipe(take(1)).subscribe(e => {
      if (this.type && this.type === 'wishlist') {
        this.removeFromWishlist(this.productId);
      }
      this.cartLabel = 'Added to cart';
      this.cartService.addToCartCountSub.next();
    }, (error) => {
    });
  }

  buynow(productId) {
    var options = {};
    this.selectedOptionList.forEach(function (element) {
      var key = element.optionId.toString();
      options[key] = element.valueId
    })
    var data = {
      "product_id": this.productId,
      "quantity": (this.quantity * this.productsDetails.bundle_quantity).toString(),
      "option": options
    }
    this.cartService.addProductToCart(data, '').pipe(take(1)).subscribe(e => {
      if (this.type && this.type === 'wishlist') {
        this.removeFromWishlist(this.productId);
      }
      this.cartService.addToCartCountSub.next();
      sessionStorage.setItem('buyNowProduct', this.productId);
      this.hideModal();
      this.router.navigate(['/cart/delivery']);
    }, (error) => {
    });

  }

  quantityValidation(event) {
    if(event.target.value === '0') {
      event.target.value = 1;
    } else {
      if ([69, 187, 188, 189, 190, 110, 46, 109, 45, 43, 107].includes(Number(event.keyCode))) {
        event.target.value = 0;
        event.target.value = 1;
      }
      var ageInput = document.getElementById("quantity")

      ageInput.addEventListener("keydown", function (e) {
        console.log(e)
        // prevent: "e", "=", ",", "-", "."
        if ([69, 187, 188, 189, 190, 48, 96, 110, 46, 109, 45, 43, 107].includes(Number(e.keyCode))) {
          e.preventDefault();
        }
      })
    }
  }

  previousProduct() {
    for(let index = 0; index < this.products.length; index++) {
      if(this.products[index]['product_id'] == this.productId) {
        this.selectedProductIndex = this.products[index-1]['product_id'];
        this.productId = this.products[index-1]['product_id']
        this.ngOnInit();
        return
      }
    }
  }

  nextProduct() {
    for(let index = 0; index < this.products.length; index++) {
      if(this.products[index]['product_id'] == this.productId) {
        this.selectedProductIndex = this.products[index+1]['product_id'];
        this.productId = this.products[index+1]['product_id'];
        this.ngOnInit();
        return
      }
    }
  }

  goCart(url: string) {
    this.hideModal();
    this.router.navigate([url]);
  }

  removeFromWishlist(productId) {
    this.wishlistService.deleteWishList(productId).subscribe(res => {
      this.wishlistService.whishListCountSub.next();
    });
  }
}
