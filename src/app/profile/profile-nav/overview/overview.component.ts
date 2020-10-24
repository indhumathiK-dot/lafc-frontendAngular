import { BestSellerHttpService } from './../../../core/services/http/bestsellerhttpservice';
import { Component, OnInit } from '@angular/core';
import { AppAccessService } from 'src/app/core/services/app-access.service';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  public currentUser;
  userForm;
  isEditMode = false;

  constructor(
    private profileService: ProfileService) { }

  ngOnInit() {
    this.loadProfile();
  }
  loadProfile() {
    this.profileService.getProfile().subscribe(data => {
      if (data.success === 1) {
        this.currentUser = data.data;
      }
    });
  }
  saveChanges(value) {
    let obj = {
      "firstname": value.firstname,
      "lastname": value.lastname,
      "email": value.email,
      "telephone": value.telephone,
      "fax": "1-541-754-3010"
    };
    this.profileService.updateProfile(obj).subscribe(
      data => {
        if (data.success === 1) {
          this.profileService.getProfile().subscribe(data => {
            if (data.success === 1) {
              this.isEditMode = !this.isEditMode;
              this.currentUser = data.data;
              localStorage.setItem("user", JSON.stringify(data.data));
            }
          });
        }
      }
    );
  }
  editProfile() {
    this.isEditMode = !this.isEditMode;
  }
  goBack() {
    this.isEditMode = !this.isEditMode;
  }
}
