import { BestSellerHttpService } from "./../core/services/http/bestsellerhttpservice";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ErrorComponentComponent} from "../core/error-component/error-component.component";
import {BsModalService} from "ngx-bootstrap";


@Component({
  selector: "app-password-reset",
  templateUrl: "./password-reset.component.html",
  styleUrls: ["./password-reset.component.css"]
})
export class PasswordResetComponent implements OnInit {
  resetForm: FormGroup;
  public validCheck: boolean = false;

  constructor(private fb: FormBuilder,
    public bestSellerHttpService: BestSellerHttpService,
    public route: ActivatedRoute,
    private router: Router,
    public modalService: BsModalService
  ) { }

  ngOnInit() {
    this.resetForm = this.fb.group({
      email: ["", [Validators.email, Validators.required, Validators.pattern('^([a-zA-Z0-9_\\-\\.\\+]+)@([a-zA-Z0-9_\\-\\.]+)\\.(\\b(?!web\\b)[a-zA-Z]{2,10})$')]]
    });
  }

  onSubmit() {
    if(this.resetForm.invalid) {
      this.validCheck = true;
    } else {
      var data = {
        email: this.resetForm.value.email
      }
      this.bestSellerHttpService.forgotPassword(data).subscribe(res => {
        if (res["success"]) {
          sessionStorage.setItem('email', this.resetForm.value.email);
         this.successUpdate();
        } else {
          this.errorUpdate();
        }
      }, (error) => {
        this.errorUpdate();
      });
    }
  }

  emailUpdate() {
    this.validCheck = this.validCheck ? (this.resetForm.invalid) : false;
  }

  successUpdate() {
    var data = {
      title: 'Forget Password',
      message: 'A mail has been sent to your registered email id with link to reset the password',
      type: 'success',
      url: '/login'
    }
    const initialState = {data: data};
    var loginModalRef = this.modalService.show(ErrorComponentComponent, Object.assign({}, { class: 'modal-md modal-dialog-centered', initialState }));
  }

  errorUpdate() {
    var data = {
      title: 'Forget Password',
      message: 'The E-Mail Address was not found in our records, please try again!',
      type: 'error'
    }
    const initialState = {data: data};
    var loginModalRef = this.modalService.show(ErrorComponentComponent, Object.assign({}, { class: 'modal-md modal-dialog-centered', initialState }));
  }
}
