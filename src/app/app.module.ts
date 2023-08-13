import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {CoreModule} from "./core/core.module";
import {AuthenticationModule} from "./components/authorization/authentication.module";
import {CustomerModule} from "./components/customer/customer.module";
import {HomeModule} from "./components/home/home.module";
import {InvoiceModule} from "./components/invoice/invoice.module";
import {NotificationModule} from "./notification.module";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AuthenticationModule,
    CustomerModule,
    InvoiceModule,
    HomeModule,
    AppRoutingModule,
    NotificationModule
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
