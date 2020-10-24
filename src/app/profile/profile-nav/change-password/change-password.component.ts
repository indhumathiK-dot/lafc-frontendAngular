import { BestSellerHttpService } from './../../../core/services/http/bestsellerhttpservice';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  public changePasswordFlag: boolean = false;
  constructor(public bestSellerHttpService: BestSellerHttpService) { }

  ngOnInit() {
  }

  submitPassword(newPassword) {
    this.bestSellerHttpService.updateNewPassword(newPassword).subscribe(res => {
      this.changePasswordFlag = true;
      if (res["success"]) {
        setTimeout(() => {
          this.changePasswordFlag = false;
        }, 2000);
      }
    });
  }

  FadeOutLink() {
    setTimeout(() => {
      this.changePasswordFlag = false;
    }, 6000);
  }

}
