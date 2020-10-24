import { Injectable } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { map, switchMap, filter, take } from 'rxjs/operators';
import { SubCategoryElement } from 'src/app/models/category.model';
import { TreeviewItem } from 'ngx-treeview';

@Injectable({
    providedIn: 'root'
})
export class SubCategoryTreeViewService {
    items: TreeviewItem;
    constructor(private categoryService: CategoryService) {

    }
}