import { BestSellerHttpService } from "./../core/services/http/bestsellerhttpservice";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";


@Component({
  selector: "app-password-reset",
  templateUrl: "./password-reset.component.html",
  styleUrls: ["./password-reset.component.css"]
})
export class PasswordResetComponent implements OnInit {
  resetForm: FormGroup;

  constructor(private fb: FormBuilder,
    public bestSellerHttpService: BestSellerHttpService,
    public route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.resetForm = this.fb.group({
      email: [""]
    });
  }

  onSubmit() {
    var data = {
      email: this.resetForm.value.email
    }
    this.bestSellerHttpService.forgotPassword(data).subscribe(res => {
          if (res["success"]) {
            this.router.navigate(["/login"]);
          }
        });
  }
}
