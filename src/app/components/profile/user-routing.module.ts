import {RouterModule, Routes} from "@angular/router";

import {NgModule} from "@angular/core";
import {UserComponent} from "./user/user.component";
import {AuthenticationGuard} from "../../guard/authentication.guard";


const userRoutes: Routes = [
  {path:'', children: [{path: '', component: UserComponent,canActivate: [AuthenticationGuard] }]},
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
