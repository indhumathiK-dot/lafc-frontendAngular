import { Component, OnInit } from '@angular/core';
import { ProductsOverviewService } from '../products/product-overview/products.overview-service';

@Component({
  selector: 'app-price-range',
  templateUrl: './price-range.component.html',
  styleUrls: ['./price-range.component.css']
})
export class PriceRangeComponent implements OnInit {

  constructor(public po: ProductsOverviewService) { }

  ngOnInit() {
  }
  onSliderChange([min,max]){
    this.po.onPriceChanged(min,max);
  }
}
