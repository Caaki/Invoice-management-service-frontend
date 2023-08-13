import {NgModule} from '@angular/core';

import {SharedModule} from "../../shared/shared.module";
import {StatsComponent} from "./stats.component";

@NgModule({
  declarations: [
    StatsComponent
  ],
  imports: [
    SharedModule
  ],
  exports:[ StatsComponent ]
})
export class StatsModule { }
