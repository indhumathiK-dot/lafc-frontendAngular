import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-range',
  templateUrl: './category-range.component.html',
  styleUrls: ['./category-range.component.css']
})
export class CategoryRangeComponent implements OnInit {
  categoriesList;
  constructor(public categoryService: CategoryService) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(data => {
      if (data.success === 1) {
        this.categoriesList = data.data;
      }
    });
  }
}
