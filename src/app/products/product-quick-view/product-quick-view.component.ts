import {Component, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {take} from "rxjs/operators";
import {ProductsService} from "../../services/products.service";
import {CartService} from "../../services/cart.service";
import {BestSellerHttpService} from "../../core/services/http/bestsellerhttpservice";

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

  constructor(private bsModalRef: BsModalRef,
              private router: Router,
              private fb: FormBuilder,
              private productsService: ProductsService,
              private cartService: CartService,
              private bestSellerHttpService: BestSellerHttpService) {
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
      color: [""],
      quantity: [""]
    });
  }

  getProductDetails(productId) {
    this.productsService.getBundleProductById(productId).pipe(take(1))
      .subscribe((products) => {
        this.productsDetails = products;
        this.fbName = this.productsDetails.name.replaceAll(' ', '-');
        this.products = this.bsModalRef["content"].productList;
        this.productMove();
        this.productImages.push(this.productsDetails.image);
        for(let i = 0; i < this.productsDetails.images.length; i++) {
          this.productImages.push(this.productsDetails.images[i]);
        }
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
    if(type === 'cart') {
      this.cartLabel = 'Adding';
    }
    this.cartService.getCartProducts().pipe(take(1))
      .subscribe((res) => {
        var cartlist = res['products'] ? res['products'] : [];
        var cartData = {};
        var cartListPresent = cartlist.some(function (el) {
          const self = this;
          if (el.product_id === productId.toString()) {
            cartData = el;
          }
          return el.product_id === productId.toString()
        });
        if (cartListPresent) {
          var quantityData = {
            "key": cartData['key'],
            "quantity": Number(cartData['quantity']) + Number(this.quantity * this.productsDetails.bundle_quantity)
          }
          this.cartService.updateProductQuantity(quantityData).pipe(take(1)).subscribe(e => {
            if(type === 'cart') {
              this.cartLabel = 'Added to cart';
            }
            if (type === 'buy') {
              this.hideModal();
              this.router.navigate(['/cart/items']);
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
            "quantity": (this.quantity * this.productsDetails.bundle_quantity).toString(),
            "option": options
          }
          this.cartService.addProductToCart(data, '').pipe(take(1)).subscribe(e => {
            if(type === 'cart') {
              this.cartLabel = 'Added to cart';
            }
            this.cartService.addToCartCountSub.next();
            if (type === 'buy') {
              this.hideModal();
              this.router.navigate(['/cart/items']);
            }
          }, (error) => {
          });
        }
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
}
