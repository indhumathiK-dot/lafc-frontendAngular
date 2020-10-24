import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { SubCategoryElement } from 'src/app/models/category.model';
import { take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryFilterService, CategoryFilterTree } from 'src/app/category/category-filter.service';
import { ProductsOverviewService } from '../product-overview/products.overview-service';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.css']
})
export class CategoryFilterComponent {

  @Input() id: string;
  @Output() selectItem: EventEmitter<any> = new EventEmitter<any>();
  categories: SubCategoryElement;
  isListOpen: boolean = true;
  isSubCategoryOpen: boolean = true;
  constructor(private categoryService: CategoryService, private route: ActivatedRoute, public catfilter: CategoryFilterService, private router: Router, private po: ProductsOverviewService) {

  }
  toggleList() {
    this.isListOpen = !this.isListOpen;
  }

  getCategories(id) {
    this.categoryService.getCategoriesByParentIdAndLevel(id, '3').pipe(take(1)).subscribe((cats) => {
      this.categories = cats;
    });
  }
  getUrlForCategory(catId) {
    let catElementTree = this.catfilter.getCategoryFilterTreeById(catId);
    let current = catElementTree;
    let cats = ['products']
    while (current && current.cat) {
      cats.push(this.categoryService.slug(current.cat.name), String(current.cat.category_id));
      current = current._parent;
    }
    cats.push('category');
    let url = cats.reverse().join('/');
    return url;

  }
  navigate(e, cat2, cat3, cat4) {
    e.stopPropagation();
    if (cat4) {

      this.catfilter.toggleSelection(cat4);
      this.po.getAllProductsByCategory(cat4);
      let url = this.getUrlForCategory(cat4);
      this.router.navigateByUrl(url);
      return false;
    };
    if (cat3) {
      this.catfilter.toggleSelection(cat3);
      this.po.getAllProductsByCategory(cat3);
      let url = this.getUrlForCategory(cat3);
      this.router.navigateByUrl(url);
      return false;
    };
    if (cat2) {
      this.catfilter.toggleSelection(cat2);
      this.po.getAllProductsByCategory(cat2);
      let url = this.getUrlForCategory(cat2);
      this.router.navigateByUrl(url);
      return false;
    };
  }


}
