import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { CategoryItemComponent } from './category-item/category-item.component';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category/category.component';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { HomeModule } from '../home/home.module';
import { NgxSpinnerModule } from 'ngx-spinner';
@NgModule({
    imports: [CommonModule, 
        FormsModule,
        CarouselModule.forRoot(),
        NgxSpinnerModule,
        CoreModule, 
        HomeModule, 
        CategoryRoutingModule],
    declarations: [CategoryComponent, CategoryItemComponent],
    exports: [CategoryComponent, HomeModule]
})
export class CategoryModule { }