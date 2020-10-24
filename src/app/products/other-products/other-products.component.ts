import { BestSellerHttpService } from "./../../core/services/http/bestsellerhttpservice";
import { Component, OnInit } from "@angular/core";
import { ProductsService } from "src/app/services/products.service";
import { Product } from "src/app/models/products.model";
import { ActivatedRoute } from "@angular/router";
import { CartProduct } from 'src/app/models/cart.model';
import {FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductsOverviewService } from '../product-overview/products.overview-service';
import { CreateOrderService } from 'src/app/services/create-order.service';
import { CategoryFilterService } from 'src/app/category/category-filter.service';
declare var $: any;

export enum prodListType {
  LIST_VIEW,
  GRID_VIEW
}

@Component({
  selector: 'app-other-products',
  templateUrl: './other-products.component.html',
  styleUrls: ['./other-products.component.css']
})
export class OtherProductsComponent implements OnInit {

  radioListType = 'listType';
  productsList: Product[];
  selectedCategoryId: string;
  selectedCategory;
  deals_id: string = null;
  deals_image: string;
  productswithBrands: Product[];
  others: any = {
    quantity: 1
  };
  productOptions: Object = {};
  productsInCart: CartProduct[] = [];

  brandItems: any[] = [];
  rangeItems: any[] = [];
  minPrice: number = 10;
  maxPrice: number = 1000;
  tickInterval: number = Math.round((this.minPrice + this.maxPrice) / 1000);
  materialItems: any[] = [];
  filteredBrandList: any[];
  filteredRangeList: any[];
  filteredMaterialList: any[];
  productCategory = {};
  deals_title;
  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    public bestSellerHttpService: BestSellerHttpService,
    public po: ProductsOverviewService,
    public co: CreateOrderService,
    public catFilter: CategoryFilterService,
    public formBuilder: FormBuilder,
    public bestsellerhttpservice: BestSellerHttpService,
    public spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.deals_id = params.get("deal_id");
      this.po.getAllProductsByDeals(this.deals_id);
      this.getListOfDeals();
    });
  }

  getListOfDeals() {
    this.bestsellerhttpservice.getListOfDeals().subscribe(res => {
      res.data.map(a => {
        if (a.deal_id === this.deals_id) {
          this.deals_image = a.image;
          this.deals_title = a.title;
        }
      });
    });
  }

  onClick(ev) {
  }


  onClickAddToCart(product: Product) {
    this.co.addToCart(product);
  }
  onChange(ev) {
  }

}
