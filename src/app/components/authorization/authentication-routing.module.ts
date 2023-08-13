import {RouterModule, Routes} from "@angular/router";
import {ResetpasswordComponent} from "./resetpassword/resetpassword.component";
import {VerifyComponent} from "./verify/verify.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {NgModule} from "@angular/core";


const authenticationRoutes: Routes = [
  {path:'login',component: LoginComponent},
  {path:'register',component: RegisterComponent},
  {path:'resetpassword',component: ResetpasswordComponent},
  {path:'user/verify/account/:key',component: VerifyComponent},
  {path:'user/verify/password/:key',component: VerifyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(authenticationRoutes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
