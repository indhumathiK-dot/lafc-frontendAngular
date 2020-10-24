import { BestSellerHttpService } from "./../../../core/services/http/bestsellerhttpservice";
import { Component, OnInit, ViewChild, NgZone } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatSelect } from '@angular/material';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import {take} from "rxjs/operators";
import {Router} from "@angular/router";


@Component({
  selector: "app-address-book",
  templateUrl: "./address-book.component.html",
  styleUrls: ["./address-book.component.css"]
})
export class AddressBookComponent implements OnInit {
  addressList: Array<any> = [];
  customerDetails: any;
  public listOfCountries: any;
  public listOfStates: any;

  addressModalRef: BsModalRef;
  // @ViewChild("addressform", { static: false })
  public addressform: NgForm;
  public addressObj = {
    firstname: '',
    lastname: '',
    custom_field: '',
    address_1: '',
    country_id: '',
    addressname: '',
    zone_id: '',
    city: '',
    postcode: '',
    default: false
  };
  public editedAddressId: number;

  constructor(public bestSellerHttpService: BestSellerHttpService,
     public modalService: BsModalService,
              private router: Router) {
  }

  ngOnInit() {
    let user = localStorage.getItem('user');
    this.customerDetails = JSON.parse(user);
    this.getAddressList();
    this.getListOfCountries();
  }

  getAddressList() {
    this.bestSellerHttpService.getAddress().pipe(take(1))
      .subscribe((res) => {
        this.addressList = res['data'].addresses;
      });
  }

  getListOfCountries() {
    this.bestSellerHttpService.getListofCountries().subscribe(res => {
      this.listOfCountries = res.data;
      this.addressObj.country_id = this.listOfCountries[105].country_id;
    });
  }

  deleteAddress(id) {
    var deleteConfirm = confirm('Are you sure you wish to delete this address?');
    if(deleteConfirm) {
      var flag = false;
      var address;
      for(let i = 0; i < this.addressList.length; i++) {
        address = this.addressList[0].address_id === id  ? (this.addressList.length === 1 ? '' : this.addressList[1]) : this.addressList[0];
        if(this.addressList[i].address_id === id && this.addressList[i].default === true) {
         flag = true;
        }
      }
      if(flag) {
        this.bestSellerHttpService.deleteAddressById(id).subscribe(res => {
          if(address) {
            address['default'] = true;
            this.bestSellerHttpService.updateAddressById(address.address_id, address).subscribe(res => {
              if (res) {
                this.getAddressList();
              }
            });
          } else {
            this.getAddressList();
          }

        });
      } else {
        this.bestSellerHttpService.deleteAddressById(id).subscribe(res => {
          this.getAddressList();
        });
      }

    }

  }

  onSelectOfCountryById(id) {
    this.bestSellerHttpService.getListOfStates(id).subscribe(res => {
      this.listOfStates = res.data.zone;
      this.addressObj.zone_id = this.listOfStates[28].zone_id;
    });
  }

  edit(template, address) {
    this.addressModalRef = this.modalService.show(template, address);
    this.addressObj = address;
    this.editedAddressId = address.address_id;
  }

  editAddress(addressId: any) {
    localStorage.setItem('addressId', addressId);
    this.router.navigate(['/address/new']);

  }
}
