import { Component, OnInit, Input } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { SortByOptions } from 'src/app/models/sortByEnum';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { concatMap, toArray, flatMap, map, mergeMap, take } from 'rxjs/operators';
import { filter } from 'minimatch';
import { SubCategoryElement } from 'src/app/models/category.model';
import { ProductsOverviewService } from '../product-overview/products.overview-service';
import { CategoryFilterService } from 'src/app/category/category-filter.service';

class BreadCrumbData {
  cat: SubCategoryElement;
  index: number;
  constructor(cat, ind) {
    this.cat = cat;
    this.index = ind;
  }
}
@Component({
  selector: 'app-toolsbar',
  templateUrl: './toolsbar.component.html',
  styleUrls: ['./toolsbar.component.css']
})
export class ToolsbarComponent implements OnInit {
  sortByOptions: SortByOptions;
  bcData: BreadCrumbData[] = [];
  @Input()productName: string;
  constructor(private categoryService: CategoryService, private route: ActivatedRoute, public po: ProductsOverviewService,public catFilter:CategoryFilterService) { }
  getLink(id) {
    let bc = this.bcData.find(e => e.cat.id === id);
    if (!bc) {
      return '';
    }
    if (bc && bc.index === 0) {
      return '/category/' + bc.cat.id + '/products';
    }
    let idx = bc.index;
    let link = '';
    for (let i = 0; i < idx; i++) {
      let next = this.bcData.find(e => e.index === i);
      link += `${next.cat.id}/`;
    }
    let l = `/category/${link}${id}/products`;
    return l;
  }
  toggle(id){
    this.catFilter.toggleSelection(id);
  }
  ngOnInit() {
    this.catFilter.getSelectedSet().subscribe(e => {
      this.bcData = this.catFilter.selectedSet.map((e,i) => {
        return new BreadCrumbData(e.cat, i);
      });
    });
  }

  onSortOptionsSelect(ev) {

  }

}
