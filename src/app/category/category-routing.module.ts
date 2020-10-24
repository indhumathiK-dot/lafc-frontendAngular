import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { ProductOverviewComponent } from '../products/product-overview/product-overview.component';


const routes: Routes = [
    {
        path: 'category/:l1_category_id/:l1_category_name/products',
        component: ProductOverviewComponent
    },
    {
        path: 'category/:l1_category_id/:l1_category_name/:l2_category_id/:l2_category_name/products',
        component: ProductOverviewComponent
    },
    {
        path: 'category/:l1_category_id/:l1_category_name/:l2_category_id/:l2_category_name/:l3_category_id/:l3_category_name/products',
        component: ProductOverviewComponent
    },
    {
        path: 'category/:l1_category_id/:l1_category_name/:l2_category_id/:l2_category_name/:l3_category_id/:l3_category_name/:l4_category_id/:l4_category_name/products',
        component: ProductOverviewComponent
    },
    {
        path: 'category/:l1_category_id/:l1_category_name/:l2_category_id/:l2_category_name/:l3_category_id/:l3_category_name/:l4_category_id/:l4_category_name/:l5_category_id/:l5_category_name/products',
        component: ProductOverviewComponent
    },
    {
        path: 'category/:l1_category_id/:l1_category_name',
        component: CategoryComponent,
    },
    {
        path: 'category/:l1_category_id/:l2_category_id/:l2_category_name',
        component: CategoryComponent,
    },
    {
        path: 'category/:l1_category_id/:l2_category_id/:l3_category_id/:l3_category_name',
        component: CategoryComponent,
    },


]
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class CategoryRoutingModule { }