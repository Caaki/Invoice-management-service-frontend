import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, map, Observable, switchMap, tap, throwError} from "rxjs";
import {CustomHttpResponse, Profile} from "../interface/appstates";
import {User} from "../interface/user";
import {Key} from "../enum/Key.enum";
import {JwtHelperService} from "@auth0/angular-jwt";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {UserService} from "../service/user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard {

  constructor(private userService: UserService, private router: Router) {

  }

  canActivate(routeSnapShot: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    return this.isAuthenticated();
  }

  private isAuthenticated():boolean {
    if (this.userService.isAuthenticated()){
      return true;
    }else{
      this.router.navigate(['/login']);
      return false;
    }
  }
}
