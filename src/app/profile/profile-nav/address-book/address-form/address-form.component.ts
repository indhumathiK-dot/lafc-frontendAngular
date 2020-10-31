import { Component, OnInit } from '@angular/core';
import { CountryService } from 'src/app/services/country.service';
import { BestSellerHttpService } from 'src/app/core/services/http/bestsellerhttpservice';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgOption} from "@ng-select/ng-select";
import {element} from "protractor";

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit {


  addressForm: FormGroup;
  address: any[] = [];
  countriesList: NgOption = [];
  countryArr = [];
  statesList: NgOption = [];
  statesArr = [];
  public errorMessage = false;

  password;
  confirmPassword;
  user;
  isError = false;
  public addressId: string;
  validationCheck = {};
  cell1TelInput = {
    initialCountry: '',
    separateDialCode: true,
  };
  private addressList: [];
  public countryCode = '+1';
  public stateIndex: number;

  constructor(private countryService: CountryService,
    public router: Router,
    public bestSellerHttpService: BestSellerHttpService,
    public dialog: MatDialog, public fb: FormBuilder) { }

  ngOnInit() {
    this.configAddress();
    this.loadCountries();
    this.getAddressList();
    if(localStorage.getItem('addressId')) {
      this.addressId = localStorage.getItem('addressId');
      localStorage.removeItem('addressId');
      this.getAddressListById(this.addressId);
    }
    this.validationCheck = {
      firstname: false,
      lastname: false,
      address: false,
      city: false,
      country: false,
      state: false,
      pincode: false,
      phone: false
    }
  }

  getAddressList() {
    this.bestSellerHttpService.getAddress().pipe(take(1))
      .subscribe((res) => {
        this.addressList = res['data'] && res['data'].addresses ? res['data'].addresses : [];
      });
  }

  configAddress() {
    this.addressForm = this.fb.group({
      firstname: [""],
      lastname: [""],
      company: [""],
      address: [""],
      subAddress: [""],
      city: [""],
      country: [''],
      state: [''],
      pincode: [""],
      phone: [""],
      defaultAddress: [false]
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
        var staeIdIndex = 0;
        data.zone.forEach((element, index) => {
          if(element.zone_id === stateId) {
            staeIdIndex = index;
          }
          myObj = {
            value: element.zone_id,
            label: element.name
          };
          this.statesArr.push(myObj);
        });
        this.stateIndex = staeIdIndex;
        this.statesList = this.statesArr;
        if(stateId) {
          this.addressForm.patchValue({state: Number(stateId)})
        }
      }
    );
  }

  getAddressListById(addressId) {
    this.bestSellerHttpService.getAddressById(addressId).pipe(take(1))
      .subscribe((res) => {
        this.loadStatesByCountryId(res['data'].country_id, res['data'].zone_id);
        var phoneArray = res['data'].phone.split(' ');
        this.countryCode = phoneArray.length === 1 ? '+1' : phoneArray[0];
        this.addressForm.patchValue({
          firstname: res['data'].firstname,
          lastname:  res['data'].lastname,
          company:  res['data'].company,
          address:  res['data'].address_1,
          subAddress:  res['data'].address_2,
          city:  res['data'].city,
          country:  Number(res['data'].country_id),
          // state:  Number(res['data'].zone_id),
          pincode:  res['data'].postcode,
          phone: phoneArray.length === 1 ? phoneArray[0] : phoneArray[1],
          defaultAddress:  res['data'].default
        })
      });
  }

  saveAddress() {
    if(!this.addressForm.value.firstname || !this.addressForm.value.firstname ||
      (!this.addressForm.value.address || !(this.addressForm.value.address.length > 2 && this.addressForm.value.address.length < 128)) ||
      !(this.addressForm.value.city && (this.addressForm.value.city.length > 2 && this.addressForm.value.city.length < 128)) || !this.addressForm.value.country ||
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
      var data = {
        "firstname": this.addressForm.value.firstname,
        "lastname": this.addressForm.value.lastname,
        "city": this.addressForm.value.city,
        "address_1": this.addressForm.value.address,
        "address_2": this.addressForm.value.subAddress,
        "country_id": this.addressForm.value.country,
        "postcode": this.addressForm.value.pincode,
        "zone_id": this.addressForm.value.state,
        "company": this.addressForm.value.company,
        "default": this.addressForm.value.defaultAddress ? 1 : 0,
        "phone": this.addressForm.value.phone ? (this.countryCode + ' ' + this.addressForm.value.phone) : null
      }
      if (this.addressId) {

        this.bestSellerHttpService.updateAddressById(this.addressId, data).subscribe(res => {
          if (res) {
            this.router.navigate(['/account/address']);
          }
        });
      } else {
        data['default'] === 0 ? (!this.addressList.length ? data['default'] = 1 : '') : '';
        this.bestSellerHttpService.postNewAddress(data).subscribe(res => {
          if (res.data) {
            this.router.navigate(['/account/address']);
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
        })
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
}
