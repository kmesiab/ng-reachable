import { Routes } from "@angular/router";

import { LoginComponent } from "app/pages/login/login.component";
import { OtpComponent } from "app/pages/otp/otp.component";
import { SignupComponent } from "app/pages/signup/signup.component";

export const PublicLayoutRoutes: Routes = [
  { path: "signup", component: SignupComponent },
  { path: "otp", component: OtpComponent },
  { path: "login", component: LoginComponent },
];
