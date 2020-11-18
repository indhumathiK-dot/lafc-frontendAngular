import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from "./profile-routing.module";
import { MyAccountComponent } from './profile-nav/my-account/my-account.component';
import { WishlistComponent } from './profile-nav/wishlist/wishlist.component';
import { AddressBookComponent } from './profile-nav/address-book/address-book.component';
import { MyOrdersComponent } from './profile-nav/my-orders/my-orders.component';
import { MyOrdersDetailsComponent } from './profile-nav/my-orders/my-orders-details/my-orders-details.component';
import { ProfileNavComponent } from './profile-nav/profile-nav.component';
import { CoreModule } from '../core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { LoginGuard } from '../cart/login.guard';
import { AvatarModule } from 'ngx-avatar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { RatingModule } from 'ngx-bootstrap/rating';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatTabsModule} from "@angular/material/tabs";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatTableModule} from "@angular/material/table";
import {AddressFormComponent} from "./profile-nav/address-book/address-form/address-form.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatRadioModule} from "@angular/material/radio";
import {MatTooltipModule} from "@angular/material/tooltip";
import {Ng2TelInputModule} from "ng2-tel-input";
@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AvatarModule,
        ModalModule.forRoot(),
        AccordionModule.forRoot(),
        RatingModule.forRoot(),
        AlertModule.forRoot(),
        TooltipModule.forRoot(),
        PaginationModule.forRoot(),
        MatIconModule,
        MatSelectModule,
        MatToolbarModule,
        MatCheckboxModule,
        MatInputModule,
        CoreModule,
        ProfileRoutingModule,
        MatTabsModule,
        FlexLayoutModule,
        MatTableModule,
        MatFormFieldModule,
        MatRadioModule,
        MatTooltipModule,
        Ng2TelInputModule
    ],
  declarations: [
    MyAccountComponent,
    ProfileNavComponent,
    WishlistComponent,
    AddressBookComponent,
    MyOrdersComponent,
    MyOrdersDetailsComponent,
    AddressFormComponent

  ],
  providers: [LoginGuard],
  exports: []
})
export class ProfileModule { }
