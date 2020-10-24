import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubCategoryElement } from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class SideMenuService {
    activatedCategories: SubCategoryElement[] = [];
    catIds: Set<string> = new Set()
    constructor(private route: ActivatedRoute){

    }
    init(){
        this.route.paramMap.subscribe(params => {
            this.catIds.clear();
            // params.getAll().forEach(e => {
                
            // })
        });
    }


}