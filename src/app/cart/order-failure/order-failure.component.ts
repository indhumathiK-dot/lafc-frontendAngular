import { Component, OnInit } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-failure',
  templateUrl: './order-failure.component.html',
  styleUrls: ['./order-failure.component.css']
})
export class OrderFailureComponent implements OnInit {

  constructor(private router: Router, private location: PlatformLocation) {
    location.onPopState(() => {
      this.router.navigate(['/cart', 'orderFailed']);
      history.forward();
    });
  }

  ngOnInit() {
  }

}
