import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../core/services/authentication.service";
import {EventsService} from "../../core/services/events.service";
import {Router} from "@angular/router";
import {CartService} from "../../services/cart.service";
import {WishListService} from "../../core/services/wishlist.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
              public events: EventsService,
              private router: Router,
              private authenticationService: AuthenticationService,
              private cartService: CartService,
              private wishlistService: WishListService) { }

  ngOnInit() {
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
          alert('No match for E-Mail Address and/or Password.')
        }
      }, (error) => {
        alert('No match for E-Mail Address and/or Password.')
      });
    }
  }
}
