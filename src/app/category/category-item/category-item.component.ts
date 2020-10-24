import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ICategory, SubCategoryElement } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.css']
})
export class CategoryItemComponent implements OnInit {
  @Input('subCategoryItem') subCategoryItem: SubCategoryElement;
  @Output('subCategoryClick') subCategoryClick: EventEmitter<SubCategoryElement> = new EventEmitter<SubCategoryElement>(); 
  constructor(public categoryService: CategoryService, public route: ActivatedRoute ,public router: Router) { }
  currentLink: string = '/category';
  ngOnInit() {
    this.route.paramMap.subscribe(e => {
    this.currentLink = this.router.url;
    });
  }
  getLink(id: string, name: string) {
    let path = this.currentLink.split('/')
    if(path.length >=3){
      return `${id}/${this.categoryService.slug(name)}/products`
    } else {
      return `${this.currentLink}/${id}/${this.categoryService.slug(name)}`
    }
  }

  onClickSubCategories(){
    this.subCategoryClick.emit(this.subCategoryItem);
  }

}
