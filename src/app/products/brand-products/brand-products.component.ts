import { BestSellerHttpService } from "./../../core/services/http/bestsellerhttpservice";
import { Component, OnInit } from "@angular/core";
import { ProductsService } from "src/app/services/products.service";
import { Product } from "src/app/models/products.model";
import { ActivatedRoute } from "@angular/router";
import { CategoryService } from "src/app/services/category.service";
import { CartProduct } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateOrderService } from 'src/app/services/create-order.service';
import { CategoryFilterService } from 'src/app/category/category-filter.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductsOverviewService } from '../product-overview/products.overview-service';
declare var $: any;

export enum prodListType {
  LIST_VIEW,
  GRID_VIEW
}

@Component({
  selector: 'app-brand-products',
  templateUrl: './brand-products.component.html',
  styleUrls: ['./brand-products.component.css']
})
export class BrandProductsComponent implements OnInit {

  radioListType = 'listType';
  productsList: Product[];
  selectedCategoryId: string;
  selectedCategory;
  brand_id: string = null;
  deals_id: string = null;
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
  brandName;
  brandImage;
  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    public bestSellerHttpService: BestSellerHttpService,
    public po: ProductsOverviewService,
    public co: CreateOrderService,
    public catFilter: CategoryFilterService,
    public formBuilder: FormBuilder,
    public spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const brandId = params.get("manufacturer_id");
      this.brandName = params.get("name");
      this.po.getAllProductsByBrand(brandId);
      this.getBrandDetails(brandId);
    });
  }



  onClick(ev) {
  }
  getBrandDetails(id) {
    this.productsService.getBrandDetailsById(id).subscribe(data => {
      if (data.success === 1) {
        this.brandImage = data.data.image;
      }
    });
  }

  // getProductsByBrand(id) {
  //   this.productsService.getProductsByMnfctrID(id).subscribe(data => {
  //     this.po.products = data;
  //   });
  // }


  onClickAddToCart(product: Product) {
    this.co.addToCart(product);
  }
  onChange(ev) {
  }
}
