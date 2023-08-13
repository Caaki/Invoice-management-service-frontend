import {RouterModule, Routes} from "@angular/router";

import {NgModule} from "@angular/core";
import {CustomerDetailComponent} from "./customer-detail/customer-detail.component";
import {AuthenticationGuard} from "../../guard/authentication.guard";
import {CustomersComponent} from "./customers/customers.component";
import {NewCustomerComponent} from "./new-customer/new-customer.component";


const customerRoutes: Routes = [
  {path:'customers',component: CustomersComponent, canActivate: [AuthenticationGuard]},
  {path:'customers/new',component: NewCustomerComponent, canActivate: [AuthenticationGuard]},
  {path:'customers/:id',component: CustomerDetailComponent, canActivate: [AuthenticationGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(customerRoutes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
