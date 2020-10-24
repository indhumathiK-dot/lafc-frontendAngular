import { BestSellerHttpService } from "./../../core/services/http/bestsellerhttpservice";
import { Component, OnInit } from "@angular/core";
import { ProductsService } from "src/app/services/products.service";
import { Product } from "src/app/models/products.model";
import { ActivatedRoute } from "@angular/router";
import { CategoryService } from "src/app/services/category.service";
import { CartProduct } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { FormBuilder } from '@angular/forms';
import { ProductsOverviewService } from './products.overview-service';
import { MatDialog } from '@angular/material/dialog';
import { CreateOrderService } from 'src/app/services/create-order.service';
import { CategoryFilterService } from 'src/app/category/category-filter.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

export enum prodListType {
  LIST_VIEW,
  GRID_VIEW
}


@Component({
  selector: "app-product-overview",
  templateUrl: "./product-overview.component.html",
  styleUrls: ["./product-overview.component.css"]
})

export class ProductOverviewComponent implements OnInit {
  cat1Image;
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
  removable = true;
  constructor(
    private route: ActivatedRoute,
    private catService: CategoryService,
    public bestSellerHttpService: BestSellerHttpService,
    public po:ProductsOverviewService,
    public co: CreateOrderService,
    public catFilter:CategoryFilterService,
    public formBuilder: FormBuilder,
    public spinner: NgxSpinnerService
  ) { }
   getLastCategoryAndLoadProducts(){
      const lastCat = this.catFilter.selectedSet[this.catFilter.selectedSet.length - 1];
      if(lastCat && lastCat.cat){
        const cat = lastCat.cat;
        this.po.getAllProductsByCategory(String(cat.category_id));
        return;
      }
   }
  setupProductCategoryLink(cats:Array<string>){
    const validCats = cats;
    let link = [];
    // tslint:disable-next-line: forin
    for(const cat of validCats){
      const categoryElement = this.catFilter.getCategoryById(+cat);
      if (categoryElement && categoryElement.name){
        link.push(categoryElement.category_id,this.catService.slug(categoryElement.name));
      }
    }
    let len = link.length;
    if ((len !== null) && (len !== undefined)) {
      let catElement = this.catFilter.getCategoryById(link[0]);
      this.cat1Image = catElement.original_image;
    }
    this.productCategory = {
      link
    };
  }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
        const level1CatId = params.get("l1_category_id");
        const level2CatId = params.get("l2_category_id");
        const level3CatId = params.get("l3_category_id");
        const level4CatId = params.get("l4_category_id");
        const brandId = params.get("manufacturer_id");
        this.setupProductCategoryLink([level1CatId,level2CatId,level3CatId,level4CatId]);
        if (level4CatId) {
          this.selectedCategoryId = level4CatId;
          this.catFilter.toggleSelection(+level4CatId);
          this.getLastCategoryAndLoadProducts();
          return;
        }
        if (level3CatId) {
          this.selectedCategoryId = level3CatId;
          this.catFilter.toggleSelection(+level3CatId);
          this.getLastCategoryAndLoadProducts();
          return;
        }
        if (level2CatId) {
          this.selectedCategoryId = level2CatId;
          this.catFilter.toggleSelection(+level2CatId);
          this.getLastCategoryAndLoadProducts();
          return;
        }
        if (level1CatId) {
          this.selectedCategoryId = level1CatId;
          this.catFilter.toggleSelection(+level1CatId);
          this.getLastCategoryAndLoadProducts();
          return;
        }
        const catId = params.get("category_id");
        this.selectedCategoryId = catId;
        this.catFilter.toggleSelection(+catId);
        this.getLastCategoryAndLoadProducts();
        return;
    });
  }
  isLinkActive(level, id) {
    return this.catService.isCatSelected(level, id);
  }
  getCategoryById() {
    this.selectedCategory = this.catFilter.getCategoryById(+this.selectedCategoryId);
  }

  onClickAddToCart(product: Product) {
    this.co.addToCart(product); 
  }

  getCategoryDetails(id) {
    this.catService.getCategoriesById(id).subscribe(data => {
      this.cat1Image = data.original_image;
    });
  }
  removeFilter() {
    this.po.selectedBrands = [];
    this.po.selectedMaterial = [];
    this.po.selectedPrice = [];
    this.po.selectedRange = [];
    this.po.products = this.po.allProducts;
    // const indexValue = this.po.selectedFilters.indexOf(filterValue);
    // if (indexValue >= 0) {
    //   this.po.selectedFilters.splice(indexValue, 1);
    // }
  }
}
