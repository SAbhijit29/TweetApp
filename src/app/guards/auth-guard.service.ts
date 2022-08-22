import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private jwtHelper: JwtHelperService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
   //get the jwt token which are present in the local storage
   const token = localStorage.getItem("jwt");

   //Check if the token is expired or not and if token is expired then redirect to login page and return false
   if (token && !this.jwtHelper.isTokenExpired(token)){
     return true;
   }
   return false;
  }

  getAuthToken(){
    const tkn = localStorage.getItem("jwt");
    return tkn;
  }
}
