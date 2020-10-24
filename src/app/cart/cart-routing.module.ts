import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { itemsComponent } from './my-cart/my-cart.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { PaymentComponent } from './payment/payment.component';
import { OrderFailureComponent } from './order-failure/order-failure.component';
import {CheckoutComponent} from "./checkout/checkout.component";

const routes: Routes = [
    { path: 'items', component: itemsComponent },
    { path: 'delivery', component: DeliveryComponent },
    { path: 'payment', component: PaymentComponent },
    { path: 'orderSuccess', component: OrderSuccessComponent },
    { path: 'orderFailed', component: OrderFailureComponent },
    { path: 'checkout', component: CheckoutComponent },
];
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class CartRoutingModule { }
