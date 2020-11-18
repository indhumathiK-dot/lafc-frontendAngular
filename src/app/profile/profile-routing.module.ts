import { AddressBookComponent } from './profile-nav/address-book/address-book.component';
import { WishlistComponent } from './profile-nav/wishlist/wishlist.component';
import { MyAccountComponent } from './profile-nav/my-account/my-account.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MyOrdersComponent } from './profile-nav/my-orders/my-orders.component';
import { MyOrdersDetailsComponent } from './profile-nav/my-orders/my-orders-details/my-orders-details.component';
import { LoginGuard } from '../cart/login.guard';
import { ProfileNavComponent } from './profile-nav/profile-nav.component';
import {AddressFormComponent} from "./profile-nav/address-book/address-form/address-form.component";

const routes: Routes = [
  {
    path: "account",
    component: ProfileNavComponent,
    // canActivate: [LoginGuard],
    children: [
      {
          path: "orders",
          component: MyOrdersComponent
      },
      {
          path: "wishlist",
          component: WishlistComponent
      },
      {
          path: "address",
          component: AddressBookComponent,
      },
      {
        path: "cards",
        component: MyAccountComponent
      },
    ]
  },
  {
    path: "orders/:order_id",
    component: MyOrdersDetailsComponent,
    // canActivate: [LoginGuard]
  },
  {
    path: 'address/new',
    component: AddressFormComponent
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
