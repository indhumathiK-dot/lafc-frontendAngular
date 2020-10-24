import { Component, OnInit, Input } from '@angular/core';
import { ProductsOverviewService } from '../product-overview/products.overview-service';

@Component({
  selector: 'app-utilities',
  templateUrl: './utilities.component.html',
  styleUrls: ['./utilities.component.css']
})
export class UtilitiesComponent implements OnInit {
  @Input() utilityItem;
  constructor(public po: ProductsOverviewService) { }

  ngOnInit() {
  }

}
