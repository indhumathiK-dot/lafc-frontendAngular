import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../core/services/authentication.service";
import {ErrorComponentComponent} from "../../../core/error-component/error-component.component";
import {BsModalService} from "ngx-bootstrap";

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  uploadedFiles: Array < File > ;
  public fileName = 'Choose a file';
  public customerDetails: any;
  public uploadSuccess: boolean = false;
  public uploadedFileName: any;

  constructor(private authService: AuthenticationService,
              public modalService: BsModalService) { }

  ngOnInit() {
    let user = localStorage.getItem('user');
    this.customerDetails = JSON.parse(user);
    this.getCustomerDetails();
  }

  getCustomerDetails() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.authService.getCustomerDetails(user['customer_id']).subscribe(res => {
      var customerDetails = res['data']['data'][0];
      var checkFileName = customerDetails.cc_auth_path ? customerDetails.cc_auth_path.split('/') : [];
      var removeTime = checkFileName.length ? checkFileName[2].split('-') : [];
      this.uploadedFileName = removeTime.length ? removeTime[2] : '';
    });
  }

  fileChange(element) {
    this.uploadedFiles = element.target.files;
    this.fileName = this.uploadedFiles[0].name;
  }

  upload() {
    let user = JSON.parse(localStorage.getItem('user'));
    if(this.uploadedFiles && this.uploadedFiles.length) {
      let formData = new FormData();
      for (var i = 0; i < this.uploadedFiles.length; i++) {
        formData.append("uploads[]", this.uploadedFiles[i], this.uploadedFiles[i].name);
        formData.append("customerId", user['customer_id']);
      }
      this.authService.invoiceUpload(formData).subscribe((res) => {
        if (res['ccAuthPath']) {
          this.updatePath(res['ccAuthPath'], this.customerDetails['customer_id']);
        }
      })
    } else {
      this.errorUpdate();
    }
  }

  updatePath(url, customerId) {
    var data = {
      customerId: customerId,
      ccAuthPath: url
    }
    this.authService.cartPathUpdate(data).subscribe((res) => {
      if(res['statusCode'] === 200) {
        this.uploadSuccess = true;
        this.uploadedFiles = [];
        this.fileName = 'Choose a file';
        this.getCustomerDetails();

      }
    })
  }

  errorUpdate() {
    var data = {
      title: 'My cards',
      message: 'Please select the file to upload!',
      type: 'error'
    }
    const initialState = {data: data};
    var loginModalRef = this.modalService.show(ErrorComponentComponent, Object.assign({}, { class: 'modal-md modal-dialog-centered', initialState }));
  }

}
