import { Component, OnInit } from "@angular/core";
import {take} from "rxjs/operators";
import {ProductsService} from "../services/products.service";
import {BestSellerHttpService} from "../core/services/http/bestsellerhttpservice";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {

  public products = [];
  public bannerImage = [];
  constructor(private productsService: ProductsService,
              private bestSellerHttpService: BestSellerHttpService) { }

  ngOnInit(): void {
    this.getInfoData();
    this.getProductList();
  }

  getProductList() {
    this.bestSellerHttpService. getBundleLatestProducts().pipe(take(1))
      .subscribe((products) => {
        this.products = products.data;
      });
  }

  getInfoData() {
    this.bestSellerHttpService.getBannerAPI().subscribe(res => {
      this.bestSellerHttpService.getBannerAPIByID(res.data[0].banner_id).subscribe(e => {
        if (e.success === 1) {
          this.bannerImage = e.data;
        }
      });
    });
  }


}
