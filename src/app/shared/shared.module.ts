import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ExtractArrayValuePipe} from "../pipe/extractvalue.pipe";

@NgModule({
  declarations: [
    ExtractArrayValuePipe
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
  ],
  exports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ExtractArrayValuePipe]
})
export class SharedModule { }
