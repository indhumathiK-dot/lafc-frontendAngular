import { BestSellerHttpService } from '../../core/services/http/bestsellerhttpservice';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit {

  public brands: any;
  public location: any;
  constructor(public bestSellerHttpService: BestSellerHttpService ) {
  }
  ngOnInit() {
   this.getBrands();
  }

  getBrands() {
    this.bestSellerHttpService.getAllBrands().subscribe( res => {
      this.brands = res;
    });
  }

}
