import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
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
        HomeModule],
    declarations: [],
    exports: [HomeModule]
})
export class CategoryModule { }
