import {RouterModule, Routes} from "@angular/router";

import {NgModule} from "@angular/core";
import {HomeComponent} from "./home/home.component";
import {AuthenticationGuard} from "../../guard/authentication.guard";


const homeRoutes: Routes = [
  {path:'',component: HomeComponent, canActivate: [AuthenticationGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
