import { Component, OnInit } from '@angular/core';
import { AppAccessService } from '../core/services/app-access.service';
import { ProfileService } from '../profile/profile.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-mandatory',
  templateUrl: './mandatory.component.html',
  styleUrls: ['./mandatory.component.css']
})
export class MandatoryComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    public appService: AppAccessService, 
    private profileService: ProfileService) { }

  ngOnInit() {
  }
  updateAccount(formValues) {
    let obj = {
      "firstname": this.appService.currentUserDetails.firstname,
      "lastname": this.appService.currentUserDetails.lastname,
      "email": this.appService.currentUserDetails.email,
      "telephone": formValues.mobileNumber,
      "fax": "1-541-754-3010"
    };
    this.profileService.updateProfile(obj).subscribe(
      data => {
        if (data.success === 1) {
          this.profileService.getProfile().subscribe(data => {
            if (data.success === 1) {
              this.bsModalRef.hide();
              localStorage.setItem("user", JSON.stringify(data.data));
            }
          });
        }
      }
    );
  }
}
