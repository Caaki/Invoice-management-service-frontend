import {NgModule} from '@angular/core';

import {SharedModule} from "../../shared/shared.module";
import {InvoiceRoutingModule} from "./invoice-routing.module";
import {InvoiceDetailComponent} from "./invoice-detail/invoice-detail.component";
import {NewinvoiceComponent} from "./newinvoice/newinvoice.component";
import {InvoicesComponent} from "./invoices/invoices.component";
import {NavbarModule} from "../navbar/navbar.module";

@NgModule({
  declarations: [
    InvoicesComponent,
    InvoiceDetailComponent,
    NewinvoiceComponent
  ],
  imports: [
    SharedModule,
    InvoiceRoutingModule,
    NavbarModule
  ],
})
export class InvoiceModule { }
