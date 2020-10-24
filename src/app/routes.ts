import { PasswordResetComponent } from './password-reset/password-reset.component';
import { NgModule } from "@angular/core";
import { PpsServicesComponent } from "./utilities/pps-services/pps-services.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { SignUpComponent } from "./core/sign-up/sign-up.component";
import {
  RouterModule,
  Routes,
  PreloadAllModules
} from "@angular/router";
import { ProductOverviewComponent } from './products/product-overview/product-overview.component';
import { CartComponent } from './cart/cart.component';
import { CoreModule } from './core/core.module';
import { CategoryModule } from './category/category.module';
import { ProductsModule } from './products/products.module';
import { ProfileModule } from './profile/profile.module';
import {ForgetPasswordComponent} from "./forget-password/forget-password.component";

const HomePageRoutes: Routes = [
  { path: "home", loadChildren: './home/home.module#HomeModule'},
  { path: "cart",  component: CartComponent, loadChildren: './cart/cart.module#CartModule' },
  {
    path: "services/:link/:title",
    component: PpsServicesComponent,
    data: { data: "test data" }
  },
  /*{
    path: "login",
    component: LoginComponent
  },*/
  // {
  //   path: "signup",
  //   component: SignUpComponent
  // },
  // {
  //   path: "profile",
  //   loadChildren: "./profile/profile.module#ProfileModule"
  // },
  {
    path: "account/forgetpassword",
    component: PasswordResetComponent
  },
  {
    path: "account/resetpassword",
    component: ForgetPasswordComponent
  },
 // { path: '', component: LoginComponent},
 { path: "**", component: PageNotFoundComponent },

];

@NgModule({
  exports: [CoreModule, RouterModule],
  imports: [CoreModule, ProductsModule, CategoryModule, ProfileModule, RouterModule.forRoot(HomePageRoutes, { onSameUrlNavigation: 'reload'})]
})
export class MainPageRoutes {}
