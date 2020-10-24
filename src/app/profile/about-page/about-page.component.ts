import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {informationServices} from "../../home/information/information.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../core/services/authentication.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})
export class AboutPageComponent implements OnInit {
  private aboutId;
  public infoDetails: any;
  public serviceName;
  contactForm: FormGroup;
  public storeDetails: any;

  constructor(private route: ActivatedRoute,
              private infoService: informationServices,
              private fb: FormBuilder,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.aboutId = params['id'];
      this.serviceName = params['service'];
      this.loadInfoById(this.aboutId);
    });
    this.configForm();
    this.loadStoreData();

  }
  configForm() {
    this.contactForm = this.fb.group({
      name: ["", Validators.required],
      email: ["",  [Validators.email, Validators.required, Validators.pattern("^([a-zA-Z0-9_\\-\\.\\+]+)@([a-zA-Z0-9_\\-\\.]+)\\.(\\b(?!web\\b)[a-zA-Z]{2,5})$")]],
      message: ["", Validators.required]
    });
  }

  loadInfoById(id) {
    this.infoService.getInfoById(id).subscribe(data => {
      this.infoDetails = data.data;
      let html = this.infoDetails.description;
      let htmlObject = document.createElement('div');
      htmlObject.innerHTML = html;
      this.infoDetails.description = htmlObject.innerText;
      console.log(this.infoDetails.description)
    });
  }

  loadStoreData() {
    this.infoService.getStoreInfo(0).subscribe(data => {
      this.storeDetails = data.data;
    });
  }

  contactSubmit() {

    if(this.contactForm.invalid) {
      return;
    } else{
      var contactData = {
        "name": "Demo User",
        "email": "test@test.com",
        "enquiry": "This is just a demo contact message."
      }
      this.authenticationService.contactMessage(contactData).subscribe(data => {
        if (data.success === 1) {
          this.contactForm.reset();
        }
      });
    }
  }
}
