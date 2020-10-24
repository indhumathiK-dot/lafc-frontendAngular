
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG
} from "@angular/platform-browser";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./app.component";
import { MainPageRoutes } from "../app/routes";
import { PpsServicesComponent } from "./utilities/pps-services/pps-services.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { HttpInterceptorService } from "./core/services/http.intercptor.service";
import { startupFactory } from "./core/services/startup.factory";
import { StartupService } from "./core/services/startup.service";
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { DeviceDetectorModule } from 'ngx-device-detector';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from "angularx-social-login";
import { PasswordResetComponent } from "./password-reset/password-reset.component";
import {
  MatFormFieldModule,
} from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { NgxSpinnerModule } from "ngx-spinner";
import { OwlModule } from 'ngx-owl-carousel';


const googleLoginOptions: any = {
  scope: "profile email"
};

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.GOOGLE_PROVIDER_ID)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.FACEBOOK_PROVIDER_ID)
  }
]);

export function provideConfig() {
  return config;
}
import { GestureConfig } from '@angular/material';
import { AlertModule } from 'ngx-bootstrap/alert';
import { DialogOverviewComponent } from "./home/dialog-overview/dialog-overview.component";
import { CartComponent } from './cart/cart.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DownloadAppComponent } from './download-app/download-app.component';
import { MandatoryComponent } from './mandatory/mandatory.component';
import { ErrorInterceptor } from './core/services/error.interceptor';
import { environment } from 'src/environments/environment';
import {CartModule} from "./cart/cart.module";
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    AppComponent,
    // HomeComponent,
    PpsServicesComponent,
    PageNotFoundComponent,
    PasswordResetComponent,
    DialogOverviewComponent,
    DownloadAppComponent,
    CartComponent,
    MandatoryComponent,
    ForgetPasswordComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFontAwesomeModule,
    HttpClientModule,
    DeviceDetectorModule.forRoot(),
    FormsModule,
    SocialLoginModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    MatFormFieldModule,
    MatInputModule,
    NgxSpinnerModule,
    MainPageRoutes,
    CartModule,
    ReactiveFormsModule,
    MatButtonModule,
    OwlModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    StartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: startupFactory,
      deps: [StartupService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogOverviewComponent, MandatoryComponent]
})
export class AppModule {}
