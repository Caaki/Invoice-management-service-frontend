import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {ResetpasswordComponent} from "./components/resetpassword/resetpassword.component";
import {VerifyComponent} from "./components/verify/verify.component";
import {CustomerComponent} from "./components/customer/customer.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {CustomersComponent} from "./components/customers/customers.component";
import {HomeComponent} from "./components/home/home.component";

const routes: Routes = [
  {path:'login',component: LoginComponent},
  {path:'register',component: RegisterComponent},
  {path:'resetpassword',component: ResetpasswordComponent},
  {path:'user/verify/account/:key',component: VerifyComponent},
  {path:'user/verify/password/:key',component: VerifyComponent},
  {path:'customer',component: CustomersComponent},
  {path:'profile',component: ProfileComponent},
  {path:'',component: HomeComponent},
  {path:'',redirectTo:'/', pathMatch:'full'},
  {path:'**',component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
