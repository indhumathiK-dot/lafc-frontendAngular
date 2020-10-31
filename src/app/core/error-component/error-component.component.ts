import { Component, OnInit } from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";
import {Router} from "@angular/router";

@Component({
  selector: 'app-error-component',
  templateUrl: './error-component.component.html',
  styleUrls: ['./error-component.component.css']
})
export class ErrorComponentComponent implements OnInit {
  data;

  constructor(private bsModalRef: BsModalRef,
              private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.data = this.bsModalRef.content.data ;
    }, 200);
  }
  onClickContinue() {

  }
  close() {
    this.bsModalRef.hide();
  }
  onClickCancel() {
    this.bsModalRef.hide();
    if(this.data.url) {
      this.router.navigate([this.data.url]);
    }
  }
}
