import { NgxSpinnerModule } from 'ngx-spinner';
import { ProductOverviewComponent } from '../products/product-overview/product-overview.component';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../core/core.module';
import { NgModule } from '@angular/core';
import { ProductsRoutingModule } from './products.routing';
import { ProductGridViewComponent } from './product-grid-view/product-grid-view.component';
import { ProductListViewComponent } from './product-list-view/product-list-view.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ToolsbarComponent } from './toolsbar/toolsbar.component';
import { CategoryFilterComponent } from './category-filter/category-filter.component';
import { TabsModule } from 'ngx-bootstrap/tabs/';
import { CustomerReviewComponent } from './customer-review/customer-review.component';
import { AvatarModule } from 'ngx-avatar';
import { MomentModule } from 'angular2-moment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NpnSliderModule } from "npn-slider";
import { PriceRangeComponent } from '../price-range/price-range.component';
import {MatDialogModule} from '@angular/material/dialog';
import { UtilitiesComponent } from './utilities/utilities.component';
import { CarouselModule as carouselBootModule} from 'ngx-bootstrap/carousel';
import {PopoverModule} from "ngx-smart-popover";
import { OtherProductsComponent } from './other-products/other-products.component';
import { BrandProductsComponent } from './brand-products/brand-products.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { EmbedVideo } from 'ngx-embed-video';
import { ShareButtonsModule } from 'ngx-sharebuttons';
import { HttpClientModule } from '@angular/common/http';
import { ProductToolbarComponent } from './product-toolbar/product-toolbar.component';
import { RatingModule } from 'ngx-bootstrap/rating';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import {HomeModule} from "../home/home.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import { ProductQuickViewComponent } from './product-quick-view/product-quick-view.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import {NgSelectModule} from "@ng-select/ng-select";
import { ImageViewComponent } from './image-view/image-view.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import { OwlModule } from 'ngx-owl-carousel';
// import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
    imports: [CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        CarouselModule,
        PopoverModule,
        MomentModule,
        NpnSliderModule,
        NgxSpinnerModule,
        AvatarModule,
        TabsModule.forRoot(),
        AccordionModule.forRoot(),
        RatingModule.forRoot(),
        carouselBootModule.forRoot(),
        BsDropdownModule.forRoot(),
        ProgressbarModule.forRoot(),
        AlertModule.forRoot(),
        EmbedVideo.forRoot(),
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        NgxImageZoomModule.forRoot(),
        ShareButtonsModule.forRoot(),
        // MatVideoModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatToolbarModule,
        MatIconModule,
        MatChipsModule,
        MatTabsModule,
        NgxMatSelectSearchModule,
        MatDialogModule,
        CoreModule,
        ProductsRoutingModule, HomeModule, FlexLayoutModule, NgSelectModule, MatPaginatorModule,
        OwlModule
        // NgSelectModule
    ],
    declarations: [
        ProductOverviewComponent,
        ProductGridViewComponent,
        ProductListViewComponent,
        ProductDetailsComponent,
        ToolsbarComponent,
        CategoryFilterComponent,
        CustomerReviewComponent,
        PriceRangeComponent,
        UtilitiesComponent,
        OtherProductsComponent,
        BrandProductsComponent,
        ProductToolbarComponent,
        ProductQuickViewComponent,
        ProductCategoryComponent,
        ImageViewComponent
    ],
    exports: [],
    entryComponents: [
      ProductQuickViewComponent,
      ImageViewComponent
    ]
})
export class ProductsModule { }
