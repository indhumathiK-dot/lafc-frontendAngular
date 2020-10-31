import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../core/services/authentication.service";
import {EventsService} from "../../core/services/events.service";
import {Router} from "@angular/router";
import {CartService} from "../../services/cart.service";
import {WishListService} from "../../core/services/wishlist.service";
import {ErrorComponentComponent} from "../../core/error-component/error-component.component";
import {BsModalService} from "ngx-bootstrap";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginValidation = {};

  constructor(private fb: FormBuilder,
              public events: EventsService,
              private router: Router,
              private authenticationService: AuthenticationService,
              private cartService: CartService,
              private wishlistService: WishListService,
              public modalService: BsModalService) { }

  ngOnInit() {
    this.loginValidation = {
      email : false,
      password: false
    }
    if(localStorage.getItem('loggedIn') === 'true') {
      this.router.navigate(['/account/orders'])
    } else {
      this.loginForm = this.fb.group({
        email: ["",  [Validators.email, Validators.required, Validators.pattern('^([a-zA-Z0-9_\\-\\.\\+]+)@([a-zA-Z0-9_\\-\\.]+)\\.(\\b(?!web\\b)[a-zA-Z]{2,10})$')]],
        password: ["", Validators.required]
      });
    }
  }

  onSubmit() {
    if(this.loginForm.invalid) {
      this.loginValidation = {
        email: this.loginForm.controls.email.invalid,
        password: this.loginForm.controls.password.invalid,
      }
      return
    } else {

      let loginObject = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        FCM_Token: ""
      }
      this.authenticationService.login(loginObject).subscribe(res => {
        if ((res.data !== null) && (res.data !== undefined)) {
          JSON.stringify(localStorage.setItem('loggedIn', 'true'));
          localStorage.setItem('user', JSON.stringify(res.data));
          this.events.loginEvent$.emit(true);
          this.cartService.addToCartCountSub.next();
          this.wishlistService.whishListCountSub.next()
          this.router.navigate(['/account/orders']);
        } else {
          this.loginErrorUpdate();
        }
      }, (error) => {
        if(error === 'Bad Request') {
          alert('Thanks for registering with us. We will email you the confirmation once it is verified')
        } else {
          this.loginErrorUpdate();
        }
      });
    }
  }

  loginErrorUpdate() {
    var data = {
      title: 'Login',
      message: 'No match for E-Mail Address and/or Password.',
      type: 'error'
    }
    const initialState = {data: data};
    var loginModalRef = this.modalService.show(ErrorComponentComponent, Object.assign({}, { class: 'modal-md modal-dialog-centered', initialState }));
  }

  validationUpdate(type, value) {
    if(value) {
      this.loginValidation[type] = false;
    }
  }
}
