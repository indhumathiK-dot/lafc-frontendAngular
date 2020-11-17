import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {take} from "rxjs/operators";
import {ProductsService} from "../../services/products.service";
import {CategoryService} from "../../services/category.service";
import {NgOption} from "@ng-select/ng-select";
import {BestSellerHttpService} from "../../core/services/http/bestsellerhttpservice";

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {
  public categoryId: any;
  public categoryName: any;
  public products = [];
  public productsTags = [];
  filterClick: boolean = false;
  public selectedFilterList = [];
  public manufacureId: any;
  public manufactureName: any;
  public sortOrder: NgOption = [];
  private brands: any;
  public ArrivalsName = '';
  firstLoadCheck: boolean;
  public productsTotalCount: any;
  public productCategoryList = [];

  constructor(private route: ActivatedRoute,
              private productsService: ProductsService,
              private catService: CategoryService,
              private bestsellerhttpservice:BestSellerHttpService) {
    this.route.params.subscribe(params => {
      this.ArrivalsName = params['name'];
      this.categoryId = params['category_id'];
      this.categoryName = params['category_name'];
      this.manufacureId = params['manufacture_id'];
      this.manufactureName = params['manufacture_name'];
      this.firstLoadCheck = false;
      if(this.categoryId) {
        this.getCategoryDetails(this.categoryId);
      } else if(this.ArrivalsName === 'New Arrival') {
        this.getProductList(48, 0);
        this.getProductListCount();
      } else {
        if(this.manufactureName === 'Manufactures') {
          this.getManufactureDetails(this.manufacureId);
        } else {
          this.getProductsByManufactureId(this.manufacureId, 48, 1);
          this.getProductsByManufactureIdCount(this.manufacureId);
        }

      }
    });
  }

  ngOnInit() {
    this.sortOrder = [
      {
        value: 1,
        label: 'Price Low to High'
      },
      {
        value: 2,
        label: 'Price High to Low'
      },
      {
        value: 3,
        label: 'A-Z'
      },
      {
        value: 4,
        label: 'Z-A'
      },
      {
        value: 5,
        label: 'Date New to Old'
      },
      {
        value: 6,
        label: 'Date Old to New'
      },
      {
        value: 7,
        label: 'New Arrival'
      }
    ]

  }

  getProductList(limit, page) {
    this.bestsellerhttpservice. getBundleLatestProductsWithLimits(limit, page).pipe(take(1))
      .subscribe((products) => {
        this.products = [];
        this.firstLoadCheck = true;
        for(let index = 0; index < products.data.length; index++) {
          this.products.push(products.data[index]);
          if(products.data[index].tag) {
            var tagArray = products.data[index].tag.split(', ');
            for(let tag = 0; tag < tagArray.length; tag++) {
              this.productsTags.push(tagArray[tag])
            }
          }
        }
        this.sorting(7);
      });
  }
  getProductListCount() {
    this.bestsellerhttpservice. getBundleLatestProducts().pipe(take(1))
      .subscribe((products) => {
       this.productsTotalCount = products.data.length;
      });
  }

  getProductsByManufactureId(manufactureId, limit, page) {
    this.products = [];
    this.productsTags = [];
    this.filterClick = false;
    this.productsService.getBundleProductsByMnfctrIDByLimit(manufactureId, limit, page).subscribe(res => {
      this.firstLoadCheck = true;
      for(let index = 0; index < res.length; index++) {
        this.products.push(res[index]);
        if(res[index].tag) {
          var tagArray = res[index].tag.split(', ');
          for(let tag = 0; tag < tagArray.length; tag++) {
            this.productsTags.push(tagArray[tag])
          }
          this.sorting(7);
        }
      }
    });
  }

  getProductsByManufactureIdCount(manufactureId) {
    this.productsService.getBundleProductsByMnfctrID(manufactureId).subscribe(res => {
      this.productsTotalCount = res.length;
    });
  }

  getCategoryDetails(id) {
    this.catService.getCategoriesById(id).subscribe(data => {
      this.productCategoryList = [];
      this.products = [];
      this.productsTags = [];
      this.filterClick = false;
      if(data.sub_categories.length ) {
        this.getProductListByCategoryId(this.categoryId);
        for(let index = 0; index< data.sub_categories.length; index++) {
          this.getProductListByCategoryId(data.sub_categories[index].category_id);
          if(index + 1 === data.sub_categories.length) {
            setTimeout(() => {
              this.splitProductsByCategory(48, 1);
            }, 1500);
          }
        }
      } else {
        this.getProductListByCategoryId(this.categoryId);
        setTimeout(() => {
          this.splitProductsByCategory(48, 1);
        }, 1500);

      }

    });
  }

  splitProductsByCategory(limit, start) {

    console.log(this.productCategoryList)
    this.productsTotalCount = this.productCategoryList.length;
    this.firstLoadCheck = true;
    var totalCheck = 0;
    for(let index = 0; index < this.productCategoryList.length; index++) {
      if(start <= index + 1 && this.products.length < limit) {
        totalCheck = totalCheck + 1;
        this.products.push(this.productCategoryList[index]);
        if(this.productCategoryList[index].tag) {
          var tagArray = this.productCategoryList[index].tag.split(', ');
          for(let tag = 0; tag < tagArray.length; tag++) {
            this.productsTags.push(tagArray[tag])
          }
          this.sorting(7);
        }
      }

    }
  }
  getManufactureDetails(id) {

    this.bestsellerhttpservice.getAllBrands().subscribe(res => {
      this.products = [];
      this.productsTags = [];
      this.filterClick = false;
      this.brands = res.data;
      for(let index = 0; index< this.brands.length; index++) {
        this.getProductsByManufactureId(this.brands[index].manufacturer_id, 48, 1);
      }
    });
  }

  getProductListByCategoryId(categoryId) {
    this.productsService.getBundleProductsByCategoryId(categoryId).pipe(take(1))
      .subscribe((products) => {
        for(let index = 0; index < products.length; index++) {
          this.productCategoryList.push(products[index]);
          // if(products[index].tag) {
          //   var tagArray = products[index].tag.split(', ');
          //   for(let tag = 0; tag < tagArray.length; tag++) {
          //     this.productsTags.push(tagArray[tag])
          //   }
          //   this.sorting(7);
          // }
        }
      });
  }

  filterSubmit(filter) {
    var tagCheck = this.selectedFilterList.some(tag => tag === filter);
    if (!tagCheck) {
      this.selectedFilterList.push(filter);
    }
    this.products = [];
    let index;
    for(index = 0; index < this.selectedFilterList.length; index++) {
      this.change(index);

    }
  }

  change(valueIndex) {
    this.productsService.searchBundleProductWithoutFilter(this.selectedFilterList[valueIndex]).pipe(take(1))
      .subscribe((products) => {
        if(valueIndex === 0) {
          this.products = products.data;
        } else {
          var uniqueValue = [];
          for(let i = 0; i < this.products.length; i++){
            for(let j = 0; j < products.data.length; j++){// inner loop
              if(this.products[i].id == products.data[j].id){
                uniqueValue.push(this.products[i])
              }
            }
          }
          this.products = uniqueValue;
        }
      });
  }
  removeIndividualFilter(tag) {
    var index = this.selectedFilterList.indexOf(tag);
    this.selectedFilterList.splice(index, 1);
    if(this.selectedFilterList.length) {
      for (var i = 0; i < this.selectedFilterList.length; i++) {
        this.filterSubmit(this.selectedFilterList[i]);
      }
    } else {
        this.removeFilter();
      }
    }

  removeFilter() {
    this.selectedFilterList = [];
    this.firstLoadCheck = false;
    if(this.categoryId) {
      this.getCategoryDetails(this.categoryId);
    } else if(this.ArrivalsName === 'New Arrival') {
      this.getProductList(48, 0);
    } else {
      if(this.manufactureName === 'Manufactures') {
        this.getManufactureDetails(this.manufacureId);
      } else {
        this.getProductsByManufactureId(this.manufacureId, 48, 1);
      }
    }
  }

  sorting(value) {

    if(value == 1) {
      this.products.sort((a, b) => (Number(a.bundle_price.replace(/[^0-9\.]+/g, "")) < Number(b.bundle_price.replace(/[^0-9\.]+/g, "")) ? -1 : 1));
    } else if(value == 2) {
      this.products.sort((a, b) => (Number(a.bundle_price.replace(/[^0-9\.]+/g, "")) > Number(b.bundle_price.replace(/[^0-9\.]+/g, "")) ? -1 : 1));
    } else if(value == 3) {
      this.products.sort((a, b) => a.name.localeCompare(b.name));
    } else if(value == 4) {
      this.products.sort((a, b) => b.name.localeCompare(a.name));
    } else if(value == 5) {
      this.products.sort((a, b) => new Date(a.date_added).getTime() - new Date(b.date_added).getTime());
    } else if(value == 6) {
      this.products.sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime());
    } else if(value == 7) {
      this.products.sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime());
    }

  }

    onChange(event) {
      this.selectedFilterList = [];
      this.products = [];
      this.productsTags = [];
      var start = (event.pageSize * event.pageIndex) + 1;

      if(this.categoryId) {
        this.splitProductsByCategory(event.pageSize, start);
      } else if(this.ArrivalsName === 'New Arrival') {
        this.getProductList(event.pageSize, start);
      } else {
        this.getProductsByManufactureId(this.manufacureId, event.pageSize, event.pageIndex + 1);
      }
    }
}
