import { Component, OnInit, Input } from '@angular/core';
import { SubCategoryElement } from 'src/app/models/category.model';
import { ProductsOverviewService } from '../product-overview/products.overview-service';
import { CategoryFilterService } from 'src/app/category/category-filter.service';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';

class BreadCrumbData {
  cat: SubCategoryElement;
  index: number;
  constructor(cat, ind) {
    this.cat = cat;
    this.index = ind;
  }
}

@Component({
  selector: 'app-product-toolbar',
  templateUrl: './product-toolbar.component.html',
  styleUrls: ['./product-toolbar.component.css']
})
export class ProductToolbarComponent implements OnInit {
  bcData: BreadCrumbData[] = [];
  @Input() productName: string;
  constructor(
    public router: Router,
    public catService: CategoryService,
    public po: ProductsOverviewService,
    public catFilter:CategoryFilterService) { }
  getLink(id) {
    let bc = this.bcData.find(e => e.cat.id === id);
    if (!bc) {
      return '';
    }
    if (bc && bc.index === 0) {
      return '/category' + bc.cat.id + '/products';
    }
    let idx = bc.index;
    let link = '';
    for (let i = 0; i < idx; i++) {
      let next = this.bcData.find(e => e.index === i);
      link += `${next.cat.id}`;
    }
    let l = `/category/${link}${id}/products`;
    return l;
  }
  ngOnInit() {
    this.catFilter.getSelectedSet().subscribe(e => {
      this.bcData = this.catFilter.selectedSet.map((e,i) => {
        return new BreadCrumbData(e.cat, i);
      });
    });
  }
  loadProductsByCategory(item) {
    if (item.index === 0) {
      this.router.navigate(['/category', item.cat.category_id, item.cat.name]);
    } else if ((item.index === 1) || (item.index === 2)) {
      this.router.navigate(['/category', this.bcData[0].cat.category_id, this.catService.slug(this.bcData[0].cat.name), this.bcData[1].cat.category_id, this.catService.slug(this.bcData[1].cat.name), this.bcData[2].cat.category_id, this.catService.slug(this.bcData[2].cat.name), 'products']);
    } else if ((item.index === 1) || (item.index === 2) || (item.index === 3)) {
      this.router.navigate(['/category', this.bcData[0].cat.category_id, this.catService.slug(this.bcData[0].cat.name), this.bcData[1].cat.category_id, this.catService.slug(this.bcData[1].cat.name), this.bcData[2].cat.category_id, this.catService.slug(this.bcData[2].cat.name), this.bcData[3].cat.category_id, this.catService.slug(this.bcData[3].cat.name), 'products']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
