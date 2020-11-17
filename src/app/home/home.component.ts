import { Component, OnInit } from "@angular/core";
import {take} from "rxjs/operators";
import {ProductsService} from "../services/products.service";
import {BestSellerHttpService} from "../core/services/http/bestsellerhttpservice";
import {CategoryService} from "../services/category.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {

  public products = [];
  public bannerImage = [];
  constructor(private productsService: ProductsService,
              private bestSellerHttpService: BestSellerHttpService,
              private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getImageDimesion();
    this.getInfoData();
    this.getProductList();
  }

  getProductList() {
    this.bestSellerHttpService. getBundleLatestProducts().pipe(take(1))
      .subscribe((products) => {
        this.products = products.data;
      });
  }

  getImageDimesion() {
    this.categoryService.getSystemSettingDimension().subscribe(res => {
      localStorage.setItem('image-dimension', JSON.stringify(res));
    })
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
