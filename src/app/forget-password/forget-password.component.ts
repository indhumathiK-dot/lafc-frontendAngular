import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {BestSellerHttpService} from "../core/services/http/bestsellerhttpservice";
import {Router} from "@angular/router";

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
              private router: Router) { }

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
    if (!this.resetForm.value.password || !this.resetForm.value.confirmPassword || this.resetForm.value.password !== this.resetForm.value.confirmPassword) {
      this.validationCheck = {
        password: !this.resetForm.value.password,
        confirmPassword: !this.resetForm.value.confirmPassword,
        samePass: this.resetForm.value.password && this.resetForm.value.confirmPassword ? (this.resetForm.value.password !== this.resetForm.value.confirmPassword ) : false
      }
      return;
    } else {

      var data = {
        password: this.resetForm.value.password,
        confirm: this.resetForm.value.confirmPassword
      }
      this.bestSellerHttpService.postForgotPassword(data).subscribe(res => {
        if (res["success"]) {
          this.router.navigate(["/login"]);
        }
      });
    }
  }

  checkValidationForm(type) {
    this.validationCheck[type] = false;
    this.validationCheck['samePass'] = this.resetForm.value.password && this.resetForm.value.confirmPassword ? (this.resetForm.value.password !== this.resetForm.value.confirmPassword ) : false;
  }
}
