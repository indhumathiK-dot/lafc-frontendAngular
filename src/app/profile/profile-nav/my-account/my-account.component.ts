import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../core/services/authentication.service";

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

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    let user = localStorage.getItem('user');
    this.customerDetails = JSON.parse(user);
  }

  fileChange(element) {
    this.uploadedFiles = element.target.files;
    this.fileName = this.uploadedFiles[0].name;
  }

  upload() {
    if(this.uploadedFiles && this.uploadedFiles.length) {
      let formData = new FormData();
      for (var i = 0; i < this.uploadedFiles.length; i++) {
        formData.append("uploads[]", this.uploadedFiles[i], this.uploadedFiles[i].name);
      }
      this.authService.invoiceUpload(formData).subscribe((res) => {
        if (res['ccAuthPath']) {
          this.updatePath(res['ccAuthPath'], this.customerDetails['customer_id']);
        }
      })
    } else {
      alert('Please select the file for upload');
    }
  }

  updatePath(url, customerId) {
    var data = {
      customerId: customerId,
      ccAuthPath: url
    }
    this.authService.updatePath(data).subscribe((res) => {
      if(res['statusCode'] === 200) {
        this.uploadSuccess = true;
        this.uploadedFiles = [];
        this.fileName = 'Choose a file';

      }
    })
  }

}
