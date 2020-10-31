import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../core/services/authentication.service";
import {StartupService} from "../../core/services/startup.service";
import {EventsService} from "../../core/services/events.service";
import {take} from "rxjs/operators";
import {BestSellerHttpService} from "../../core/services/http/bestsellerhttpservice";
import {ShippingAddressService} from "../../services/shipping-address.service";
import {NgOption} from "@ng-select/ng-select";
import {CountryService} from "../../services/country.service";
import {CreateOrderService} from "../../services/create-order.service";

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  addressForm: FormGroup;
  selectedAddress = '';
  public customerDetails: any;
  public addressList: any;
  public selectDropdown = [];
  project = [];
  countriesList: NgOption = [];
  countryArr = [];
  statesList: NgOption = [];
  statesArr = [];
  fullAddressList: NgOption = [];
  addressArr = [];
  newAddress: boolean = false;
  validationCheck = {};
  public countryCode = '+1';
  cell1TelInput = {
    initialCountry: '',
    separateDialCode: true,
  };

  constructor(private fb: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService,
              private startupService: StartupService,
              private events: EventsService,
              private shippingAddressService: ShippingAddressService,
              private countryService: CountryService,
              private bestSellerHttpService: BestSellerHttpService,
              private createOrderService: CreateOrderService) { }

  ngOnInit() {
    this.createOrderService.shippingMethodId = 'free.free'
    let user = localStorage.getItem('user');
    this.customerDetails = JSON.parse(user);
    this.configForm();
    this.loadCountries();
    this.getAddressList();
    this.emptyValidation();
  }

  emptyValidation() {
    this.validationCheck = {
      firstname: false,
      lastname: false,
      address: false,
      city: false,
      country: false,
      state: false,
      pincode: false,
    }
  }

  configForm() {
    this.addressForm = this.fb.group({
      savedAddress: [""],
      firstname: [""],
      lastname: [''],
      company: [''],
      address: [''],
      subAddress: [''],
      city: [''],
      country: [''],
      state: [''],
      pincode: [''],
      phone: []
    });
  }

  loadCountries() {
    this.countryService.getcountryNames().subscribe(
      data => {
        var myObj = {};
        data.forEach(element => {
          myObj = {
            value: element.country_id,
            label: element.name
          };
          this.countryArr.push(myObj);
        });
        this.countriesList = this.countryArr;
      }
    )
  }

  onSelectCountry(event) {
    this.validationCheck['country'] = false;
    this.loadStatesByCountryId(event);
  }

  loadStatesByCountryId(id, stateId?) {
    this.statesArr = [];
    this.addressForm.controls['state'].reset();
    this.countryService.getStatesName(id).pipe(take(1)).subscribe(
      data => {
        var myObj = {};
        data.zone.forEach(element => {
          myObj = {
            value: element.zone_id,
            label: element.name
          };
          this.statesArr.push(myObj);
        });
        this.statesList = this.statesArr;
        console.log('1')

        if(stateId) {
          this.addressForm.patchValue({state: Number(stateId)})
        }

      }
    );
  }

  getAddressList() {
    this.shippingAddressService.getAddress().pipe(take(1))
      .subscribe((res) => {
        this.addressList = res['data'] && res['data'].addresses ? res['data'].addresses : [];
        var myObj = {};
        if(this.addressList.length) {
          for(let i = 0; i < this.addressList.length; i++) {
            myObj = {
              value: this.addressList[i].address_id,
              label: this.addressList[i].address_1 + ', ' + (this.addressList[i].address_2 ? this.addressList[i].address_2 + ', ' : '') + this.addressList[i].city + ', ' + this.addressList[i].postcode + ', ' + this.addressList[i].zone + ', ' + this.addressList[i].country + ' ( ' + this.addressList[i].firstname + ' ' + this.addressList[i].lastname + ' ' + this.addressList[i].company + ')'
            };
            this.addressArr.push(myObj);
            this.selectDropdown.push({id: this.addressList[i].address_id, address: this.addressList[i].address_1 + ', ' + this.addressList[i].address_2 + ', ' + this.addressList[i].city + ', ' + this.addressList[i].postcode + ', ' + this.addressList[i].zone + ', ' + this.addressList[i].country + ' ( ' + this.addressList[i].firstname + ' ' + this.addressList[i].lastname + ' ' + this.addressList[i].company + ')'});
            if(this.addressList[i].address_id === res['data'].address_id) {
              this.loadStatesByCountryId(this.addressList[i].country_id, this.addressList[i].zone_id);
              this.createOrderService.shippingAddressId = this.addressList[i].address_id;
              this.createOrderService.paymentAddressId = this.addressList[i].address_id;
              var phoneArray = this.addressList[i].phone.split(' ');
              this.countryCode = phoneArray.length === 1 ? '+1' : phoneArray[0];
              this.addressForm.patchValue({
                savedAddress: this.addressList[i].address_id,
                firstname: this.addressList[i].firstname,
                lastname: this.addressList[i].lastname,
                company: this.addressList[i].company,
                address: this.addressList[i].address_1,
                subAddress: this.addressList[i].address_2,
                city: this.addressList[i].city,
                country: Number(this.addressList[i].country_id),
                pincode: this.addressList[i].postcode,
                phone: phoneArray.length === 1 ? phoneArray[0] : phoneArray[1],
              })
            }
          }
          this.addressArr.push({
            value: '0',
            label: 'Add New Address'
          })
          this.fullAddressList = this.addressArr;
        } else {
          this.addressArr.push({
            value: '0',
            label: 'Add New Address'
          })
          this.fullAddressList = this.addressArr;
        }

      });
  }

  userLogout() {
    this.authenticationService.logOutCurrentUser().subscribe(
      res => {
        localStorage.clear();
        this.startupService.getAuthToken().then(
          res => {
            this.events.logoutEvent$.emit(true);
            sessionStorage.removeItem('buyNowProduct');
            this.router.navigate(["/login"]);
          });
      });
  }

  getAddressListById(addressId) {
    this.emptyValidation();
    if(addressId == '0') {
     this.newAddress = true;
     this.addressForm.reset();
     this.addressForm.patchValue({
       savedAddress: '0'
     })
    } else {
      this.createOrderService.shippingAddressId = addressId;
      this.createOrderService.paymentAddressId = addressId;
      this.bestSellerHttpService.getAddressById(addressId).pipe(take(1))
        .subscribe((res) => {
          var phoneArray = res['data'].phone.split(' ');
          this.countryCode = phoneArray.length === 1 ? '+1' : phoneArray[0];
          this.loadStatesByCountryId(res['data'].country_id, res['data'].zone_id);
          this.addressForm.patchValue({
            savedAddress: res['data'].address_id,
            firstname: res['data'].firstname,
            lastname: res['data'].lastname,
            company: res['data'].company,
            address: res['data'].address_1,
            subAddress: res['data'].address_2,
            city: res['data'].city,
            country: Number(res['data'].country_id),
            pincode: res['data'].postcode,
            phone: phoneArray.length === 1 ? phoneArray[0] : phoneArray[1],
          })
        });
    }
  }


  onSubmitValue() {
    if (!this.addressForm.value.firstname || !this.addressForm.value.firstname ||
      !(this.addressForm.value.address && this.addressForm.value.address.length > 2 && this.addressForm.value.address.length < 128) ||
      !(this.addressForm.value.city && this.addressForm.value.city.length > 2 && this.addressForm.value.city.length < 128) || !this.addressForm.value.country ||
      !this.addressForm.value.state || !(this.addressForm.value.pincode && (this.addressForm.value.pincode.length > 4 && this.addressForm.value.pincode.length < 10)) ||
      (this.addressForm.value.phone ? !(this.digits_count(Number(this.addressForm.value.phone)) > 7 && this.digits_count(Number(this.addressForm.value.phone)) < 32) : false)) {
      this.validationCheck = {
        firstname: !this.addressForm.value.firstname,
        lastname: !this.addressForm.value.lastname,
        address: !(this.addressForm.value.address && (this.addressForm.value.address.length > 2 && this.addressForm.value.address.length < 128)),
        city: !(this.addressForm.value.city && (this.addressForm.value.city.length > 2 && this.addressForm.value.city.length < 128)),
        country: !this.addressForm.value.country,
        state: !this.addressForm.value.state,
        pincode: !(this.addressForm.value.pincode && (this.addressForm.value.pincode.length > 4 && this.addressForm.value.pincode.length < 10)),
        phone:  this.addressForm.value.phone ? !(this.digits_count(Number(this.addressForm.value.phone)) > 7 && this.digits_count(Number(this.addressForm.value.phone)) < 32) : false
      }
      return;
    } else {
      if (this.newAddress) {
        let obj = {
          "firstname": this.addressForm.value.firstname,
          "lastname": this.addressForm.value.lastname,
          "city": this.addressForm.value.city,
          "address_1": this.addressForm.value.address,
          "address_2": this.addressForm.value.subAddress,
          "country_id": this.addressForm.value.country,
          "postcode": this.addressForm.value.pincode,
          "zone_id": this.addressForm.value.state,
          "company": this.addressForm.value.company,
          "phone": this.addressForm.value.phone ? (this.countryCode + ' ' + this.addressForm.value.phone) : null
        };

        this.bestSellerHttpService.postNewAddress(obj).subscribe(res => {
          if (res.data) {
            this.createOrderService.shippingAddressId = res.data.address_id;
            this.createOrderService.paymentAddressId = res.data.address_id;
            this.createOrderService.onOrderCreate();
          }
        });
      } else {
        let obj = {
          "firstname": this.addressForm.value.firstname,
          "lastname": this.addressForm.value.lastname,
          "city": this.addressForm.value.city,
          "address_1": this.addressForm.value.address,
          "address_2": this.addressForm.value.subAddress,
          "country_id": this.addressForm.value.country,
          "postcode": this.addressForm.value.pincode,
          "zone_id": this.addressForm.value.state,
          "company": this.addressForm.value.company,
          "phone": this.addressForm.value.phone ? (this.countryCode + ' ' + this.addressForm.value.phone) : null
        };
        this.bestSellerHttpService.updateAddressById(this.createOrderService.shippingAddressId, obj).subscribe(res => {
          if (res) {
            this.createOrderService.onOrderCreate();
          }
        });

      }
    }
  }

  checkValidationForm(type, value) {
    if(type === 'address') {
      this.validationCheck[type] = this.validationCheck[type] ? !(this.addressForm.value.address && this.addressForm.value.address.length > 2 && this.addressForm.value.address.length < 128) : false;
    } else if(type === 'city') {
      this.validationCheck[type] = this.validationCheck[type] ? !(this.addressForm.value.city && this.addressForm.value.city.length > 2 && this.addressForm.value.city.length < 128) : false;
    } else if(type === 'pincode') {
      this.validationCheck[type] = this.validationCheck[type] ? !(this.addressForm.value.pincode && this.addressForm.value.pincode.length > 4 && this.addressForm.value.pincode.length < 10) : false;
    } else if(type === 'phone') {
      var pattern = /^[0-9]*$/;
      if(!pattern.test(value)) {
        value = value.slice(0, -1);
        this.addressForm.patchValue({
          phone: value
        });
      }
      this.validationCheck[type] =  this.validationCheck[type] ? (!(this.addressForm.value.phone && (this.digits_count(this.addressForm.value.phone) > 7 && this.digits_count(this.addressForm.value.phone) < 32))) : false;
    } else {
      if(value) {
        this.validationCheck[type] = false;
      }
    }
  }
  digits_count(n) {
    var count = 0;
    if (n >= 1) ++count;

    while (n / 10 >= 1) {
      n /= 10;
      ++count;
    }

    return count;
  }

  onCell1CountryChange($event: any) {
    this.countryCode =  '+' + $event.dialCode;
  }

  returnRedirect(url: string) {
    sessionStorage.removeItem('buyNowProduct');
    this.router.navigate([url]);
  }
}
