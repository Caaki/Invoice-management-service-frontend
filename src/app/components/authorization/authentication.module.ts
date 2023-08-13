import {NgModule} from '@angular/core';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from './register/register.component';
import {ResetpasswordComponent} from "./resetpassword/resetpassword.component";
import {VerifyComponent} from "./verify/verify.component";
import {SharedModule} from "../../shared/shared.module";
import {AuthenticationRoutingModule} from "./authentication-routing.module";


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ResetpasswordComponent,
    VerifyComponent,
  ],
  imports: [
    SharedModule,
    AuthenticationRoutingModule
  ],
})
export class AuthenticationModule { }
