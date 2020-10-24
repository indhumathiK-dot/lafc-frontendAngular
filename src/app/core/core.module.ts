import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule, Routes} from '@angular/router';
import { HttpClientModule } from '@angular/common/http'
import { TreeviewModule } from 'ngx-treeview';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MatInputModule } from '@angular/material/input';
import { NavComponent } from './nav/nav.component';
import { SubCategoryTreeComponent } from './sub-category-tree/sub-category-tree.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ErrorComponentComponent } from './error-component/error-component.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AlertModule } from 'ngx-bootstrap/alert';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidebarComponent } from './sidebar/sidebar.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import { MenubarComponent } from './menubar/menubar.component';

const routes: Routes = [
]
@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TreeviewModule.forRoot(),
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        AlertModule.forRoot(),
        MatFormFieldModule,
        MatIconModule,
        MatCheckboxModule,
        MatSelectModule,
        NgxSpinnerModule,
        MatToolbarModule,
        MatAutocompleteModule,
        MatInputModule,
        RouterModule,
        MatSidenavModule,
        // RouterModule.forRoot(routes)
    ],
    declarations: [
        HeaderComponent,
        NavComponent,
        SubCategoryTreeComponent,
        FooterComponent,
        SignUpComponent,
        ErrorComponentComponent,
        SidebarComponent,
        MenubarComponent
    ],
  exports: [
    HeaderComponent,
    NavComponent,
    SubCategoryTreeComponent,
    FooterComponent,
    SidebarComponent,
  ]
})
export class CoreModule { }
