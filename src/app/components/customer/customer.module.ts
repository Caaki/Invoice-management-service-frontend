import {NgModule} from '@angular/core';

import {SharedModule} from "../../shared/shared.module";
import {NewCustomerComponent} from "./new-customer/new-customer.component";
import {CustomerDetailComponent} from "./customer-detail/customer-detail.component";
import {CustomersComponent} from "./customers/customers.component";
import {CustomerRoutingModule} from "./customer-routing.module";
import {NavbarModule} from "../navbar/navbar.module";


@NgModule({
  declarations: [
    CustomerDetailComponent,
    CustomersComponent,
    NewCustomerComponent
  ],
  imports: [
    SharedModule,
    CustomerRoutingModule,
    NavbarModule
  ],
})
export class CustomerModule { }
