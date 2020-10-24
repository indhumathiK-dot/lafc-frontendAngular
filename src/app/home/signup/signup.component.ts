import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../core/services/authentication.service";
import {Router} from "@angular/router";
import {ProfileService} from "../../profile/profile.service";
import {CountryService} from "../../services/country.service";
import {take} from "rxjs/operators";
import {NgOption} from "@ng-select/ng-select";
import {BestSellerHttpService} from "../../core/services/http/bestsellerhttpservice";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  public loginCheck: boolean;
  public userDetails: any;
  countriesList: NgOption = [];
  countryArr = [];
  statesList: NgOption = [];
  statesArr = [];
  uploadedFiles: Array < File > ;
  public fileName = 'Choose a file';
  validationCheck = {};
  passwordConfirmationCheck: boolean = false;
  cell1TelInput = {
    initialCountry: '',
    separateDialCode: true,
  };

  constructor(private fb: FormBuilder,
              private authService: AuthenticationService,
              private router: Router,
              private profileService: ProfileService,
              private countryService: CountryService,
              private bestSellerHttpService: BestSellerHttpService) { }

  ngOnInit() {
    this.configForm();
    this.loadCountries();
    this.loginCheck = localStorage.getItem('loggedIn') === 'true';
    if(this.loginCheck) {
      this.loadProfile();
      this.getCustomerDetails();
    }
    this.validationCheck = {
      firstname: false,
      lastname: false,
      phoneNumber: false,
      email: false,
      password: false,
      confirmPassword: false,
      address: false,
      city: false,
      country: false,
      state: false,
      zip: false,
      sellersPermit: false,
      uploadCC: false,
      sellOption: false
    }
  }
  configForm() {
    this.registerForm = this.fb.group({
      firstname: [""],
      lastname: [""],
      businessName: [''],
      phoneNumber: [''],
      email: ['', [Validators.email, Validators.pattern('^([a-zA-Z0-9_\\-\\.\\+]+)@([a-zA-Z0-9_\\-\\.]+)\\.(\\b(?!web\\b)[a-zA-Z]{2,10})$')]],
      password: [''],
      confirmPassword: [''],
      newsLetter: [''],
      address: [""],
      city: [""],
      country: [],
      state: [],
      zip: [""],
      sellersPermit: [''],
      uploadCC: [''],
      websiteUrl: [''],
      sellOption: ['3']
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

  getAddressListById(addressId) {
    this.bestSellerHttpService.getAddressById(addressId).pipe(take(1))
      .subscribe((res) => {
        this.loadStatesByCountryId(res['data'].country_id, res['data'].zone_id);
        this.registerForm.patchValue({
          firstname: res['data'].firstname,
          lastname:  res['data'].lastname,
          address:  res['data'].address_1,
          city:  res['data'].city,
          country:  Number(res['data'].country_id),
          zip:  res['data'].postcode,
          businessName: res['data'].company,
        })
      });
  }

  onSelectCountry(event) {
    this.validationCheck['country'] = false;
    this.loadStatesByCountryId(event);
  }

  loadStatesByCountryId(id, stateId?) {
    this.statesArr = [];
    this.registerForm.controls['state'].reset();
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
        if(stateId) {
          this.registerForm.patchValue({state: Number(stateId)})
        }
      }
    );
  }


  loadProfile() {
    this.profileService.getProfile().subscribe(data => {
      if (data.success === 1) {
        this.userDetails = data.data;
        this.getAddressListById(this.userDetails.address_id);
        this.registerForm.patchValue({
          "firstname": this.userDetails.firstname,
          "lastname": this.userDetails.lastname,
          "email": this.userDetails.email,
          "phoneNumber": this.userDetails.telephone,
          "sellersPermit": this.userDetails.tax_id
        })
      }
    });
  }

  getCustomerDetails() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.authService.getCustomerDetails(user['customer_id']).subscribe(res => {
      var customerDetails = res['data']['data'][0];
      this.fileName = customerDetails.cc_auth_path;
      this.registerForm.patchValue({
        "uploadCC": customerDetails.cc_auth_path,
        "websiteUrl": customerDetails.social_url,
        "sellOption": customerDetails.sell_option === 'Online' ? '1' : (customerDetails.sell_option === 'Store Front' ? '2' : (customerDetails.sell_option === 'Both') ? '3' : '3'),
      })
    });
  }

  createAccount() {
      if (this.loginCheck) {
        if(!this.registerForm.value.firstname || !this.registerForm.value.lastname || !this.registerForm.value.phoneNumber ||
          !this.registerForm.value.email || !this.registerForm.value.sellersPermit || !this.registerForm.value.address || !this.registerForm.value.city ||
          !this.registerForm.value.country || !this.registerForm.value.state || !this.registerForm.value.zip) {
          this.validationCheck = {
            firstname: !this.registerForm.value.firstname,
            lastname: !this.registerForm.value.lastname,
            phoneNumber: !this.registerForm.value.phoneNumber,
            email: !this.registerForm.value.email,
            address: !this.registerForm.value.address || this.registerForm.value.address.length < 3 || this.registerForm.value.city.length > 128,
            city: !this.registerForm.value.city || this.registerForm.value.city.length < 3 || this.registerForm.value.address.city > 128,
            country: !this.registerForm.value.country,
            state: !this.registerForm.value.state,
            zip: !this.registerForm.value.zip,
            sellersPermit: !this.registerForm.value.sellersPermit
          }
          return;
        } else {
          var updateObject = {
            "firstname": this.registerForm.value.firstname,
            "lastname": this.registerForm.value.lastname,
            "email": this.registerForm.value.email,
            "telephone": this.registerForm.value.phoneNumber,
            "tax_id": this.registerForm.value.sellersPermit
          }

          this.authService.updateAccount(updateObject).subscribe(
            data => {
              if (data.success === 1) {
                let user = JSON.parse(localStorage.getItem('user'));
                this.upload(user['customer_id']);
                this.profileService.getProfile().subscribe(data => {
                  if (data.success === 1) {
                    var dataAddress = {
                      "firstname": this.registerForm.value.firstname,
                      "lastname": this.registerForm.value.lastname,
                      "city": this.registerForm.value.city,
                      "address_1": this.registerForm.value.address,
                      "country_id": this.registerForm.value.country,
                      "postcode": this.registerForm.value.zip,
                      "zone_id": this.registerForm.value.state,
                      "company": this.registerForm.value.businessName,
                    }
                    this.bestSellerHttpService.updateAddressById(this.userDetails.address_id, dataAddress).subscribe(res => {
                      if (res) {
                        this.router.navigate(['/account/orders']);
                      }
                    });
                  }
                });
              }
            }
          );
        }
      } else {
        if(!this.registerForm.value.firstname || !this.registerForm.value.lastname || !this.registerForm.value.phoneNumber ||
          !this.registerForm.value.email || (!this.registerForm.value.password && !this.registerForm.value.confirmPassword && this.registerForm.value.password === this.registerForm.value.confirmPassword) ||
          !this.registerForm.value.address || !this.registerForm.value.city || !this.registerForm.value.country ||
          !this.registerForm.value.state || !this.registerForm.value.zip || !this.uploadedFiles || !this.registerForm.value.sellersPermit) {
          this.validationCheck = {
            firstname: !this.registerForm.value.firstname,
            lastname: !this.registerForm.value.lastname,
            phoneNumber: !this.registerForm.value.phoneNumber || ((this.registerForm.value.phoneNumber).toString).length < 3 || ((this.registerForm.value.phoneNumber).toString).length > 32,
            email: !this.registerForm.value.email,
            password: !this.registerForm.value.password || this.registerForm.value.password.length < 6 || this.registerForm.value.password.length > 20,
            confirmPassword: !(this.registerForm.value.confirmPassword && this.registerForm.value.password === this.registerForm.value.confirmPassword) || this.registerForm.value.confirmPassword.length < 4 || this.registerForm.value.confirmPassword.length > 20,
            address: !this.registerForm.value.address,
            city: !this.registerForm.value.city,
            country: !this.registerForm.value.country,
            state: !this.registerForm.value.state,
            zip: !this.registerForm.value.zip,
            uploadCC: !this.uploadedFiles,
            sellOption: !this.registerForm.value.sellOption,
            sellersPermit: !this.registerForm.value.sellersPermit
          }
          this.passwordConfirmationCheck = this.registerForm.value.password && this.registerForm.value.confirmPassword ? (this.registerForm.value.password === this.registerForm.value.confirmPassword ? false : true ) : false;
          return;
        } else {
          var registerObject = {
            "firstname": this.registerForm.value.firstname,
            "lastname": this.registerForm.value.lastname,
            "company": this.registerForm.value.businessName,
            "email": this.registerForm.value.email,
            "password": this.registerForm.value.password,
            "confirm": this.registerForm.value.confirmPassword,
            "telephone": this.registerForm.value.phoneNumber,
            "city": this.registerForm.value.city,
            "address_1": this.registerForm.value.address,
            "address_2": this.registerForm.value.city + ' ' + this.registerForm.value.state + ' ',
            "postcode": this.registerForm.value.zip,
            "country_id": this.registerForm.value.country,
            "zone_id": this.registerForm.value.state,
            "FCM_Token": "string",
            "tax_id": this.registerForm.value.sellersPermit,
            "agree": "1",
          }
          this.authService.register(registerObject).subscribe(res => {
            if ((res.data !== null) && (res.data !== undefined)) {
              this.upload(res.data['customer_id']);
              // this.router.navigate(['/']);
              // alert('Thank you for registering with LAFC! You will be notified by e-mail once your account has been activated by the store owner.');
              // JSON.stringify(localStorage.setItem('loggedIn', 'true'));
              // localStorage.setItem('user', JSON.stringify(res.data));
              var dataAddress = {
                "firstname": this.registerForm.value.firstname,
                "lastname": this.registerForm.value.lastname,
                "city": this.registerForm.value.city,
                "address_1": this.registerForm.value.address,
                "address_2": '',
                "country_id": this.registerForm.value.country,
                "postcode": this.registerForm.value.zip,
                "zone_id": this.registerForm.value.state,
                "company": this.registerForm.value.businessName,
                "phone": this.registerForm.value.phoneNumber,
                "default": 1,
              }
              this.bestSellerHttpService.postNewAddress(dataAddress).subscribe(res => {
                if (res.data) {
                  this.router.navigate(['/']);
                }
              });
            } else {
              // alert(res);
            }
          }, (error) => {
            console.log(error)
            alert('error' + error)
          });
        }
      }

  }

  fileChange(element) {
    this.validationCheck['uploadCC'] = false;
    this.uploadedFiles = element.target.files;
    this.fileName = this.uploadedFiles[0].name;
  }

  upload(customerId) {
    if(this.uploadedFiles) {
      let formData = new FormData();
      for (var i = 0; i < this.uploadedFiles.length; i++) {
        formData.append("uploads[]", this.uploadedFiles[i], this.uploadedFiles[i].name);
      }
      this.authService.invoiceUpload(formData).subscribe((res) => {
        if (res['ccAuthPath']) {
          this.updatePath(res['ccAuthPath'], customerId);
        }
      })
    } else {
      this.updatePath('', customerId);
    }
  }

  updatePath(url, customerId) {
    var data = {
      customerId: customerId,
      ccAuthPath: url,
      sellerPermit: this.registerForm.value.sellersPermit,
      socialUrl: this.registerForm.value.websiteUrl,
      sellOption: this.registerForm.value.sellOption === '1' ? 'Online' : (this.registerForm.value.sellOption === '2' ? 'Store Front' : (this.registerForm.value.sellOption === '3' ? 'Both' : 'Both' ))
    }
    this.authService.updatePath(data).subscribe((res) => {
      if(res['statusCode'] === 200) {

      }
    })
  }

  checkValidationForm(type) {
    this.validationCheck[type] = false;
    if(type === 'confirmPassword' || type === 'password') {
      this.passwordConfirmationCheck = this.registerForm.value.password && this.registerForm.value.confirmPassword ? (this.registerForm.value.password === this.registerForm.value.confirmPassword ? false : true ) : false;
    }
  }

  customSearchFn(term: string, item) {
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.countryName.toLocaleLowerCase() === term;
  }

  onClear() {

  }

  onFocus($event: any) {

  }

  onKeyUP($event: KeyboardEvent) {

  }
}
