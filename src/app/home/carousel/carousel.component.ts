import { Component, OnInit } from '@angular/core';
import { BestSellerHttpService } from 'src/app/core/services/http/bestsellerhttpservice';



declare var $: any;

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  bannersList = [];
  constructor(private bs: BestSellerHttpService) {
  }

  ngOnInit() {
    this.loadCarouselBanners();
  }
  loadCarouselBanners() {
    this.bs.getBannerAPIByID(7).subscribe(e => {
      if (e.success === 1) {
        this.bannersList = e.data;
      }
    });
  }

}
