import { Injectable, NgZone } from '@angular/core';
import { CartService } from './cart.service';
import { take, tap } from 'rxjs/operators';
import { ShippingMethodsService } from './shipping-methods.service';
import { ShippingAddressService } from './shipping-address.service';
import { OrdersService, CreateOrder } from './orders.service';
import { Router } from '@angular/router';
import { AddressService } from './address.service';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentAddressService } from './payment-address.service';
import { CouponsService } from './coupons.service';
import { WalletService } from './wallet.service';
import { Product } from '../models/products.model';
import { Subject } from "rxjs";
import { PincodeService } from './pincode.service';
import { AppAccessService } from '../core/services/app-access.service';
import { Title } from '@angular/platform-browser';
import { GoogleAnalyticsService } from './google-analytics.service';

@Injectable({
  providedIn: 'root'
})
export class CreateOrderService {
  public others: any = {
    quantity: 1
  };
  public productOptions: Object = {};
  public productsInCart: any[] = [];
  public cart;
  public cartCount;
  public cartItem;
  public isInStock = true;
  public couponcodeData;
  public walletBalanceData;
  public shippingAddress;
  public paymentAddress;
  public selectedShippingAddress;
  public selectedPaymentAddress;
  public shippingMethod;
  public paymentMethod;
  public addressList;

  public paymentAddressId: string;
  public shippingAddressId: string;
  public shippingMethodId;
  public shippingMethodAlert;
  public isAddressPresent = false;

  public payment_method;
  public shippingComment;
  public paymentMethodId;
  public orderSummary;
  public selectedPaymentMethod;
  public address;
  public canAdd: boolean = true;
  public isCartEmpty: boolean = true;
  public paymentAddress$;
  public addToCartCount: number;
  public addToCartCountSub: Subject<any> = new Subject();
  public cartimage: Subject<any> = new Subject();
  public isPincodeValid = false;
  public pinValidDescription;
  public selectedAddress;
  public isCodAvailable = true;

  isError = false;
  newErrorMsg;
  addToCartError;

  constructor(private cartService: CartService,
    private shippingAddressService: ShippingAddressService,
    private ordersService: OrdersService,
    private router: Router,
    private addrService: AddressService,
    public paymentAddressService: PaymentAddressService,
    public shippingMethodsService: ShippingMethodsService,
    private paymentMethods: PaymentMethodsService,
    private shippingMethodService: ShippingMethodsService,
    private couponService: CouponsService,
    private walletService: WalletService,
    private pincodeService: PincodeService,
    private appService: AppAccessService,
    private ngZone: NgZone) {

  }
  // Cart items
  loadCartProducts() {
    this.ngZone.run(() => {
      this.cartService.getCartProducts().pipe(take(1)).subscribe(e => {
        this.cart = e;
        if (Object.entries(this.cart).length === 0) {
          this.isCartEmpty = true;
        } else {
          this.isCartEmpty = false;
          this.productsOutOfStock();
          if ((this.appService.getCurrentUserLoginFlag() === true) && (this.cart.applied_wallet === null ||
            this.cart.applied_wallet === undefined) && (this.cart.wallet_balance > 0)) {
            this.getWalletBalance();
          }
        }
      });
    });
  }
  productsOutOfStock() {
    if (this.cart.products.length > 0) {
      this.cart.products.map(e => {
        if (e.stock === false) {
          this.isInStock = false;
          return this.isInStock;
        } else {
          this.isInStock = true;
        }
      });
    }
  }
  addToCart(product: Product) {
    let options = product.options;
    options.forEach(opt => {
      let optValue = opt.option_value;
      if (optValue && optValue[0] === undefined) {
        this.canAdd = false;
      } else {
        this.onProductOptionsChanged(null, opt.product_option_id, opt.option_value[0].product_option_value_id);
      }
    });
    let newCartItem = {
      "product_id": product.product_id,
      "quantity": this.others.quantity,
      "option": this.productOptions
    };
    let productimage = {
      "image": product.image
    };
    let items = [];
    items[0] = localStorage.setItem('cartItem', JSON.stringify(newCartItem));
    this.cartService.addProductToCart(newCartItem, productimage).pipe(take(1)).subscribe(e => {
      // this.addToCartCountSub.next(this.addToCartCount);
      this.cartimage.next(productimage);
      this.productsInCart.push(e);
    }, (error) => {
      this.newErrorMsg = error.error.map((error) => error);
      this.addToCartError = this.newErrorMsg[0];
      this.isError = true;
    });
  }
  onProductOptionsChanged(e, prodOptId, optId) {
    this.productOptions = {
      ...this.productOptions,
      [prodOptId]: optId
    };
  }
  // cartQuantityUpdate() {
  //   let quantity = {
  //     "key": this.cartItem.key,
  //     "quantity": this.cartItem.quantity
  //   };
  //   this.cartService.updateProductQuantity(quantity).pipe(take(1)).subscribe(
  //     data => {
  //       let qty = this.cartItem.quantity;
  //       qty = data;
  //     }
  //   );
  // }

  deleteProductFromCart(p) {
    this.cartService.deleteCartProduct(p).pipe(take(1)).
      subscribe(e => {
        this.loadCartProducts();
      });
  }
  // Apply/remove coupons
  applyCoupon(couponcode) {
    let codeObj = {
      "coupon": couponcode
    };
    return this.couponService.setCoupon(codeObj).pipe(
      tap((data) => {
        this.couponcodeData = data;
        if (data.success === 1) {
          this.loadCartProducts();
        }
      }));
  }
  removeCoupon() {
    this.couponService.removeCoupon().pipe(take(1)).subscribe(
      data => {
        if (data.success === 1) {
          this.loadCartProducts();
        }
      }
    );
  }
  // Apply/remove wallet balance
  getWalletBalance() {
    this.walletService.getWalletBalance().pipe(take(1)).subscribe(data => {
      this.walletBalanceData = data;
      var productCost = this.cart.totals.find(e => {
        e.title === 'Sub-Title';
        return e.value;
      });
      if (this.walletBalanceData.success === 1) {
        if (this.cart.wallet_balance === 0) {
          return;
        }
        if (this.cart.wallet_balance > productCost.value) {
          let b = productCost.value;
          this.applyWalletBalance(b);
        }
        if (this.cart.wallet_balance <= productCost.value) {
          let b = this.cart.wallet_balance;
          this.applyWalletBalance(b);
        }
      }
    });
  }
  applyWalletBalance(balance) {
    return this.walletService.applyWalletBalance(balance).pipe(take(1)).subscribe((data) => {
      if (data.success === 1) {
        this.cartService.getCartProducts().pipe(take(1)).subscribe(e => {
          this.cart = e;
        });
      }
    });
  }
  removeWalletBalanceApplied() {
    return this.walletService.removeAppliedWalletBalance().pipe(
      tap((data) => {
        if (data.success === 1) {
          return this.loadCartProducts();
        }
      })
    );
  }
  //Apply GSTIN
  applyGst(obj) {
    this.ordersService.addGstIn(obj).pipe(take(1)).subscribe(
      e => {

      }
    );
  }

  //Load Address
  loadAllAddress() {
    this.ngZone.run(() => {
      this.shippingAddressService.getAddress().pipe(take(1)).subscribe(
        data => {
          if (data.success === 1) {
            this.addressList = data.data.addresses;
            console.log(data);
            if (data.data === []) {
              this.isAddressPresent = false;
            }
            if (this.addressList.length > 0) {
              this.isAddressPresent = true;
              this.getAllShippingMethods();
            }
            if ((this.addressList !== null) && (this.addressList !== undefined)) {
              this.paymentAddressId = this.addressList[0].address_id;
              this.checkPincode(this.paymentAddressId);
              this.shippingAddressId = this.addressList[0].address_id;
              this.checkPincode(this.shippingAddressId);
            }
          }
        }
      );
    });
  }
  // Add address
  addNewAddress(formValue) {
    this.shippingAddressService.addAddress(formValue).pipe(take(1)).subscribe(
      data => {
        if (data.success === 1) {
          // let a = this.address.push(data);
          if(sessionStorage.getItem("saObj") && sessionStorage.getItem("paObj")) {
            sessionStorage.removeItem("saObj");
            sessionStorage.removeItem("paObj");
            this.loadAllAddress();
          } else if (sessionStorage.getItem("saObj")) {
            sessionStorage.removeItem("saObj");
            this.loadAllAddress();
          } else {

            this.loadAllAddress();
          }
          // this.loadAllAddress();
        }
      }
    );
  }
  // Shipping methods
  getAllShippingMethods() {
    this.shippingMethodService.getShippingMethods().pipe(take(1)).subscribe(
      (data) => {
        if (data.success === 1) {
          this.shippingMethod = data.data.shipping_methods;
          this.shippingMethodId = this.shippingMethod[0].quote[0].code;
          // if (this.shippingMethod.free) {
          //   this.shippingMethodId = this.shippingMethod.free.quote.free.code;
          // } else if (this.shippingMethod.flat) {
          //   this.shippingMethodId = this.shippingMethod.flat.quote.flat.code;
          // } else if (this.shippingMethod.pickup) {
          //   this.shippingMethodId = this.shippingMethod.pickup.quote.pickup.code;
          // } else {
          //   this.shippingMethodId = '';
          // }
        }
      }
    );
  }

  // on Order Create
  onOrderCreate() {
    if (this.paymentAddressId && this.shippingAddressId, this.shippingMethodId) {
      localStorage.setItem('shipAddrId', this.shippingAddressId);
      localStorage.setItem('paymentAddrId', this.paymentAddressId);
      localStorage.setItem('shippingMethod', this.shippingMethodId);
      let createOrder = new CreateOrder(this.paymentAddressId, this.shippingAddressId, this.shippingMethodId);
      // this.ordersService.createOrderAS(createOrder).subscribe((e) => {
      //   this.router.navigate(['/cart', 'payment']);
      // });
      this.ordersService.createOrderAS(createOrder);
    } else {
      this.shippingMethodAlert = "Please select a shipping Method";
    }
  }

  setSelectedAddressID(shippingAddrId, paymentAddrId) {
    this.setSelectedPaymentAddr(paymentAddrId);
    this.setSelectedShippingAddr(shippingAddrId);
  }
  setSelectedShippingAddr(addrId) {
    this.addrService.getAddressById(addrId).pipe(take(1)).subscribe(
      data => {
        this.shippingAddress = data.data;
        let pincode = this.shippingAddress.postcode;
        this.verifyPincode(pincode);
        this.getPaymentMethods();
      }
    );
  }
  setSelectedPaymentAddr(addrId) {
    this.addrService.getAddressById(addrId).pipe(take(1)).subscribe(
      data => {
        this.paymentAddress = data.data;
        let pincode = this.paymentAddress.postcode;
        this.verifyPincode(pincode);
        this.getPaymentMethods();
      }
    );
  }

  // Payment methods
  getPaymentMethods() {
    this.ngZone.run(() => {
      this.paymentMethods.getPaymentMethods().pipe(take(1)).subscribe(
        data => {
          this.paymentMethod = data;
        }
      );
    });
  }
  // radio clicks
  onPaymentMethodSelect(pm) {
    this.paymentMethods.addPaymentMethod(pm, this.shippingComment).pipe(take(1)).subscribe();
  }
  checkPincode(addressId) {
    this.addrService.getAddressById(addressId).subscribe(
      data => {
        this.selectedAddress = data.data;
        if (data.data !== null && data.data !== undefined) {
          let pincode = this.selectedAddress.postcode;
          this.pincodeService.checkPincodeDeliveries(pincode).pipe(take(1)).subscribe(
            res => {
              if (res.deliverydetails.length === 1) {
                this.isPincodeValid = true;
                this.pinValidDescription = res.deliverydetails[0].description;
              } else {
                this.isPincodeValid = false;
                this.isCodAvailable = res.iscashondeliveryavailable;
              }
            });
        }
      });
  }
  verifyPincode(pincode) {
    this.pincodeService.checkPincodeDeliveries(pincode).pipe(take(1)).subscribe(
      res => {
        if (res.deliverydetails.length === 1) {
          this.isPincodeValid = true;
          this.pinValidDescription = res.deliverydetails[0].description;
        } else {
          this.isPincodeValid = false;
          this.isCodAvailable = res.iscashondeliveryavailable;
        }
      });
  }
}
