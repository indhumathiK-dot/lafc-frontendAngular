import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductDetailsComponent } from './product-details/product-details.component';
import {ProductCategoryComponent} from "./product-category/product-category.component";

const routes = [
    {
        path: 'products/:name/:product_id',
        component: ProductDetailsComponent
    },
  {
    path: 'products/:product_id',
    component: ProductDetailsComponent
  },
    {
      path: 'products/collections/:category_name/:category_id',
      component: ProductCategoryComponent
    },
  {
    path: 'products/collections/brands/:manufacture_name/:manufacture_id',
    component: ProductCategoryComponent
  },
  {
    path: 'collections/new-arrival/:name',
    component: ProductCategoryComponent
  },
    {
        path: 'products/:cat1_id/:cat1_name/:name/:product_id',
        component: ProductDetailsComponent
    },
    {
        path: 'products/:cat1_id%2Fcat1_name/:name/:product_id',
        component: ProductDetailsComponent
    },
    {
        path: 'products/:cat1_id/:cat1_name/:cat2_id/:cat2_name/:name/:product_id',
        component: ProductDetailsComponent
    },
    {
        path: 'products/:cat1_id/:cat1_name/:cat2_id/:cat2_name/:cat3_id/:cat3_name/:name/:product_id',
        component: ProductDetailsComponent
    },
    {
        path: 'products/:cat1_id/:cat1_name/:cat2_id/:cat2_name/:cat3_id/:cat3_name/:cat4_id/:cat4_name/:name/:product_id',
        component: ProductDetailsComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class ProductsRoutingModule { }
