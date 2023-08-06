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
import {AuthenticationGuard} from "./guard/authentication.guard";
import {NewCustomerComponent} from "./components/new-customer/new-customer.component";
import {InvoicesComponent} from "./components/invoices/invoices.component";
import {NewinvoiceComponent} from "./components/newinvoice/newinvoice.component";
import {InvoiceComponent} from "./components/invoice/invoice.component";

const routes: Routes = [
  {path:'login',component: LoginComponent},
  {path:'register',component: RegisterComponent},
  {path:'resetpassword',component: ResetpasswordComponent},
  {path:'user/verify/account/:key',component: VerifyComponent},
  {path:'user/verify/password/:key',component: VerifyComponent},
  {path:'profile',component: ProfileComponent,canActivate: [AuthenticationGuard]},
  {path:'customers',component: CustomersComponent, canActivate: [AuthenticationGuard]},
  {path:'customers/new',component: NewCustomerComponent, canActivate: [AuthenticationGuard]},
  {path:'customers/:id',component: CustomerComponent, canActivate: [AuthenticationGuard]},
  {path:'invoices',component: InvoicesComponent, canActivate: [AuthenticationGuard]},
  {path:'invoices/new',component: NewinvoiceComponent, canActivate: [AuthenticationGuard]},
  {path:'invoices/:id/:invoiceNumber',component: InvoiceComponent, canActivate: [AuthenticationGuard]},
  {path:'',component: HomeComponent, canActivate: [AuthenticationGuard]},
  {path:'',redirectTo:'/', pathMatch:'full'},
  {path:'**',component: HomeComponent,canActivate: [AuthenticationGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
