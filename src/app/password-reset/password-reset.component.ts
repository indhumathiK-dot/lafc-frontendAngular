import { BestSellerHttpService } from "./../core/services/http/bestsellerhttpservice";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


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
    private router: Router
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
          alert('A mail has been sent to your registered email id with link to reset the password');
          this.router.navigate(["/login"]);
        } else {
          alert('The E-Mail Address was not found in our records, please try again!');
        }
      }, (error) => {
        alert('The E-Mail Address was not found in our records, please try again!');
      });
    }
  }

  emailUpdate() {
    this.validCheck = this.validCheck ? (this.resetForm.invalid) : false;
  }
}
