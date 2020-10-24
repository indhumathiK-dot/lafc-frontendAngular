import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { SubCategoryElement } from 'src/app/models/category.model';
import { BestSellerHttpService } from 'src/app/core/services/http/bestsellerhttpservice';
import { CategoryFilterService } from '../category-filter.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppAccessService } from 'src/app/core/services/app-access.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categoryItemList: SubCategoryElement;
  private currentLevel;
  currentLink: string = '/category';
  brands;
  showRecetlyViewedflag: boolean = false;
  recentlyViewed;
  public cust_id: any;
  selectedSet:any[];
  user;
  constructor(private route: ActivatedRoute, 
    public categoryService: CategoryService,
    public catFilter:CategoryFilterService,
    public bestsellerhttpservice: BestSellerHttpService,
    public spinner: NgxSpinnerService,
    public appAccessService: AppAccessService,
    public productService: ProductsService,
    private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(e => {
      this.currentLink = this.router.url;
      const catId = e.get('category_id');
      const l1_catId = e.get('l1_category_id');
      const l2_catId = e.get('l2_category_id');
      const l3_catId = e.get('l3_category_id');
      if (l3_catId) {
        this.currentLevel = 3;
        this.getCategoriesById(l3_catId);
        return;
      }
      if (l2_catId) {
        this.currentLevel = 2;
        this.getCategoriesById(l2_catId);
        return;
      }
      if (l1_catId) {
        this.currentLevel = 1;
        this.getCategoriesById(l1_catId);
        return;
      }
    });
    this.getBrands();
    this.user = this.appAccessService.getCurrentUserDetails();
    if ((this.user !== null) && (this.user !== undefined)) {
      this.cust_id = this.user.customer_id;
      this.showRecetlyViewedflag = true;
      this.getRecentlyViewedBy();
    } else {
      this.cust_id = '';
      this.showRecetlyViewedflag = false;
    } 
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }
  getLink(id: string, name: string) {
    let path = this.currentLink.split('/')
    if(path.length >=3){
      return `${id}/${this.categoryService.slug(name)}/products`
    } else {
      return `${this.currentLink}/${id}/${this.categoryService.slug(name)}`
    }
  }

  getCategoriesById(id) {
    this.catFilter.toggleSelection(id);
    this.categoryItemList = this.catFilter.getCategoryById(+id);
    this.selectedSet = this.catFilter.selectedSet;
  }
  getBrands() {
    this.bestsellerhttpservice.getAllBrands().subscribe(res => {
      this.brands = res;
    });
  }

  getRecentlyViewedBy(){
    this.productService.getRecentView(this.cust_id).subscribe(products => {
      this.recentlyViewed = products.data;
    });
  }
  productSelected(data) {
    let linkArray = data.category.map(a => (`/${this.categoryService.slug(a.id)}`) + (`/${this.categoryService.slug(a.name)}`));
    let a = linkArray.toString();
    let b = a.replace(",", "");
    this.router.navigate(["/products" + b +`/${data.id}`]);
  }

}
