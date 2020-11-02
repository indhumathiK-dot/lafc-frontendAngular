import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {BestSellerHttpService} from "../core/services/http/bestsellerhttpservice";
import {Router} from "@angular/router";
import {ErrorComponentComponent} from "../core/error-component/error-component.component";
import {BsModalService} from "ngx-bootstrap";

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  validationCheck = {};

  constructor(private fb: FormBuilder,
              public bestSellerHttpService: BestSellerHttpService,
              private router: Router,
              public modalService: BsModalService) { }

  ngOnInit() {
    this.validationCheck = {
      password: false,
      confirmPassword: false,
      samePass: false
    }
    this.resetForm = this.fb.group({
      password: [""],
      confirmPassword: ['']
    });
  }

  onSubmit() {
    if (!this.resetForm.value.password || !this.resetForm.value.confirmPassword || this.resetForm.value.password !== this.resetForm.value.confirmPassword || this.resetForm.value.password.length <6) {
      this.validationCheck = {
        password: !(this.resetForm.value.password && (this.resetForm.value.password.length > 6 && this.resetForm.value.password.length < 20)),
        confirmPassword: !((this.resetForm.value.confirmPassword) && (this.resetForm.value.confirmPassword.length > 6 && this.resetForm.value.confirmPassword.length < 20)),
        samePass: this.resetForm.value.password && this.resetForm.value.confirmPassword ? (this.resetForm.value.password !== this.resetForm.value.confirmPassword ) : false
      }
      return;
    } else {

      var email = sessionStorage.getItem('email');
      var data = {
        email: email,
        password: this.resetForm.value.password,
        confirm: this.resetForm.value.confirmPassword
      }
      this.bestSellerHttpService.postForgotPassword(data).subscribe(res => {
        if (res["success"]) {
          sessionStorage.removeItem('email');
          this.successUpdate();
        }
      });
    }
  }

  checkValidationForm(type) {
    if(type === 'confirmPassword') {
      this.validationCheck[type] = this.validationCheck[type] ? !(this.resetForm.value.confirmPassword && (this.resetForm.value.confirmPassword.length > 5 && this.resetForm.value.confirmPassword.length < 20)) : false;
    } else if(type === 'password') {
      this.validationCheck[type] = this.validationCheck[type] ? !(this.resetForm.value.password && (this.resetForm.value.password.length > 5 && this.resetForm.value.password.length < 20)) : false;
    }
    this.validationCheck['samePass'] = (this.resetForm.value.password && this.resetForm.value.confirmPassword && (this.resetForm.value.confirmPassword.length > 5 && this.resetForm.value.confirmPassword.length < 20) && (this.resetForm.value.password.length > 5 && this.resetForm.value.password.length < 20)) ? (this.resetForm.value.password === this.resetForm.value.confirmPassword) ? false : true : false;
  }

  successUpdate() {
    var data = {
      title: 'Reset Password',
      message: 'Password Resetted successfully',
      type: 'success',
      url: '/login'
    }
    const initialState = {data: data};
    var loginModalRef = this.modalService.show(ErrorComponentComponent, Object.assign({}, { class: 'modal-md modal-dialog-centered', initialState }));
  }
}
