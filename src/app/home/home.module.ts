import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryRangeComponent } from './category-range/category-range.component';
import { CarouselModule } from "ngx-owl-carousel-o";
import { CarouselComponent } from './carousel/carousel.component';
import { ProductsCarouselComponent } from './products-carousel/products-carousel.component';
import { BannerMainpageComponent } from './banner-mainpage/banner-mainpage.component';
import { RouterModule, Routes } from '@angular/router';
import { BrandsComponent } from './brands/brands.component';
import { HomeComponent } from './home.component';
import { CoreModule } from '../core/core.module';
import { InformationComponent } from './information/information.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailsComponent } from './blog/blog-details.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ContactusComponent } from './contactus/contactus.component';
import { AgmCoreModule } from '@agm/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AvatarModule } from 'ngx-avatar';
import { DomsafePipe } from './domsafe.pipe';
import { LoginComponent } from './login/login.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {FlexLayoutModule} from "@angular/flex-layout";
import { ProductListComponent } from './product-list/product-list.component';
import {MatDialogModule} from "@angular/material/dialog";
import { SearchListComponent } from './search-list/search-list.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import { SignupComponent } from './signup/signup.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import {NgSelectModule} from "@ng-select/ng-select";
import { Ng2TelInputModule } from "ng2-tel-input";
import {MatSelectModule} from "@angular/material/select";

const routes: Routes = [
  {path:'login', component: LoginComponent},
  {path:'search', component: SearchListComponent},
  { path: '', component: HomeComponent},
  { path: "brands", component: BrandsComponent },
  { path: 'disclaimer/:id', component: InformationComponent },
  { path: 'payment-and-security/:id', component: InformationComponent },
  { path: 'shipping-and-delivery/:id', component: InformationComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: "signup", component: SignupComponent },

  {
    path: "terms-and-condition/:id",
    component: InformationComponent
  },

  {
    path: "exchange-return/:id",
    component: InformationComponent
  },

  {
    path: "return-policy/:id",
    component: InformationComponent
  },

  {
    path: "cancellation-policy/:id",
    component: InformationComponent
  },
  {
    path: "privacy-policy/:id",
    component: InformationComponent
  },
  { path: "blog", component: BlogComponent },
  { path: 'blog/:title/:ArticleId', component: BlogDetailsComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'contactus', component: ContactusComponent }
];
@NgModule({
  declarations: [HomeComponent, CarouselComponent, CategoryRangeComponent, ProductsCarouselComponent,
    BannerMainpageComponent, BrandsComponent,
    InformationComponent, TestimonialsComponent, DomsafePipe, BlogComponent, BlogDetailsComponent, GalleryComponent, ContactusComponent, LoginComponent, ProductListComponent, SearchListComponent, SignupComponent,
    ],
    imports: [CommonModule, CarouselModule, MatDialogModule, Ng2TelInputModule,
        AgmCoreModule.forRoot({
            // apiKey: 'AIzaSyBNdRhxl_RRvbpsJHDX2orxrF-ydDI9KYg', // Replace with Google API key
            apiKey: 'AIzaSyC7CSU5OoOtYz597Lz2uYDU0XhxUA4nIWI', // Kalanjiam Google API key
            libraries: ['places']
        }),
        ModalModule.forRoot(),
        AvatarModule,
        CoreModule, RouterModule.forChild(routes), MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule, FlexLayoutModule, MatPaginatorModule, MatCheckboxModule, MatRadioModule, NgSelectModule, MatSelectModule],
    exports: [HomeComponent, CarouselComponent, DomsafePipe, CategoryRangeComponent, ProductsCarouselComponent, ContactusComponent,
        BannerMainpageComponent, BlogComponent, BlogDetailsComponent, BrandsComponent, RouterModule, ProductListComponent,LoginComponent],
  providers: [],
  entryComponents: [LoginComponent, ]
})
export class HomeModule { }
