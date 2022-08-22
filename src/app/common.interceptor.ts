import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthGuard } from './guards/auth-guard.service';

@Injectable()
export class CommonInterceptor implements HttpInterceptor {

  constructor(private authService:AuthGuard) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = this.authService.getAuthToken();

    if(token){
      request = request.clone({
        setHeaders:{Authorization:`Bearer ${token}`}
      });
    }
    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
            // redirect user to the logout page
            localStorage.removeItem("jwt");
            console.log("No token");
         }
      }
      return throwError(err);
    })
     )
  }


}
