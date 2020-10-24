import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { take } from 'rxjs/operators';
import { SubCategoryElement } from 'src/app/models/category.model';
import { CategoryFilterService } from 'src/app/category/category-filter.service';

@Component({
  selector: 'app-sub-category-tree',
  templateUrl: './sub-category-tree.component.html',
  styleUrls: ['./sub-category-tree.component.css']
})


export class SubCategoryTreeComponent implements OnChanges {

  selectedItem: string;
  @Input() id: string;
  @Output() itemHover: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCatClicked: EventEmitter<any> = new EventEmitter<any>();
  categories: SubCategoryElement[];
  category_l1_name;
  category_l1_id;

  constructor(private route: ActivatedRoute, private categoryService: CategoryService, public catFilter: CategoryFilterService) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.id) {
      this.getCategories(this.id);
    }
  }
  getCategories(id) {
    let cats = this.catFilter.getCategoryById(+id);
    if (cats) {
      this.category_l1_name = cats.name;
      this.category_l1_id = cats.category_id;
      this.categories = cats.categories;
    }
  }

  onHover(e: any, type: any, image: string) {
    this.selectedItem = image;
    this.itemHover.emit(this.selectedItem);
  }
  clickedCategory(ev) {
    this.onCatClicked.emit(this.selectedItem);
  }
  slug(text) {
    return this.categoryService.slug(text);
  }
}
