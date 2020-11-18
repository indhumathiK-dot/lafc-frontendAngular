import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../core/core.module';
import { NgModule } from '@angular/core';
import { ProductsRoutingModule } from './products.routing';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { TabsModule } from 'ngx-bootstrap/tabs/';
import { CustomerReviewComponent } from './customer-review/customer-review.component';
import { AvatarModule } from 'ngx-avatar';
import { MomentModule } from 'angular2-moment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NpnSliderModule } from "npn-slider";
import {MatDialogModule} from '@angular/material/dialog';
import { CarouselModule as carouselBootModule} from 'ngx-bootstrap/carousel';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { EmbedVideo } from 'ngx-embed-video';
import { HttpClientModule } from '@angular/common/http';
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
        // MatVideoModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatToolbarModule,
        MatIconModule,
        MatChipsModule,
        MatTabsModule,
        MatDialogModule,
        CoreModule,
        ProductsRoutingModule, HomeModule, FlexLayoutModule, MatPaginatorModule,
        OwlModule
        // NgSelectModule
    ],
    declarations: [
        ProductDetailsComponent,
        CustomerReviewComponent,
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
