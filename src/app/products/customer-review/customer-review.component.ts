import { Component, OnInit, Input } from '@angular/core';
import { Review} from 'src/app/models/products.model';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-customer-review',
  templateUrl: './customer-review.component.html',
  styleUrls: ['./customer-review.component.css']
})
export class CustomerReviewComponent implements OnInit {
  reviewOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<img src=\'../../assets/images/left.png\'>',
    '<img src=\'../../assets/images/right.png\'>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  };
  @Input() reviews: Review[];
  constructor() { }

  ngOnInit() {
  }
}
