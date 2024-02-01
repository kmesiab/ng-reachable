import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from "ngx-toastr";

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { FixedPluginModule} from './shared/fixedplugin/fixedplugin.module';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { SignupComponent } from './pages/signup/signup.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { OtpComponent } from './pages/otp/otp.component';
import { UserService } from "./services/user.service";
import { CurrentUserService } from "./services/current-user.service";
import { OtpService } from "./services/otp.service";
import { HttpClientModule } from "@angular/common/http";
import { PhoneService } from "./services/phone.service";
import { LocalStorageService } from "./services/local-storage.service";


@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    PublicLayoutComponent,
  ],
  imports: [
    HttpClientModule,
    LoginComponent,
    SignupComponent,
    OtpComponent,
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes,{
      useHash: true
    }),
    SidebarModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FixedPluginModule
  ],
  providers: [
    LocalStorageService,
    UserService,
    CurrentUserService,
    OtpService,
    PhoneService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
