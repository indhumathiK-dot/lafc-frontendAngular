import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { CartItemComponent } from './cart-item/cart-item.component';
import { CartRoutingModule } from './cart-routing.module';
import { CoreModule } from '../core/core.module';
import { itemsComponent } from './my-cart/my-cart.component';
import { DeliveryComponent } from './delivery/delivery.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { MomentModule } from 'angular2-moment';
import {MatFormFieldModule} from '@angular/material/form-field';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CheckoutComponent } from './checkout/checkout.component';
import {MatTableModule} from "@angular/material/table";
import {FlexModule} from "@angular/flex-layout";
import {Ng2TelInputModule} from "ng2-tel-input";
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatToolbarModule,
        MatIconModule,
        MomentModule,
        MatCheckboxModule,
        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        AlertModule.forRoot(),
        NgxSpinnerModule,
        CoreModule,
        CartRoutingModule,
        MatTableModule,
        ReactiveFormsModule,
        FlexModule,
        Ng2TelInputModule,
    ],
    declarations: [
        CartItemComponent,
        itemsComponent,
        DeliveryComponent,
        OrderSuccessComponent,
        CheckoutComponent
    ],
    exports: [
        NgxSpinnerModule,
        CartItemComponent,
    ],
  providers: [
  ]

})
export class CartModule { }
