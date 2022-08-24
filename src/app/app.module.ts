import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from '@auth0/angular-jwt';
import { ToastNoAnimationModule,ToastNoAnimation, ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth-guard.service';
import { HomepageComponent } from './Homepage/homepage/homepage.component';
import { LoginComponent } from './login/login/login.component';
import { SignupComponent } from './signup/signup/signup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonInterceptor } from './common.interceptor';
import { HomeComponent } from './Component/home/home.component';


// const routes: Routes = [ 
//   { path: '', component: HomepageComponent },
//   { path: 'login', component: LoginComponent },
//   { path: 'registration', component: SignupComponent },
// ];

//function is use to get jwt token from local storage
export function tokenGetter() {
  return localStorage.getItem("jwt");
}

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastNoAnimationModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:7299"],
        disallowedRoutes: []
      }
  }),
  ToastrModule.forRoot(),
    FormsModule,
    // MatButtonModule, 
    // MatCheckboxModule,
    // MatInputModule,
    // MatFormFieldModule,
    BrowserAnimationsModule
  ],
  providers: [AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CommonInterceptor,
      multi: true
     }],
  bootstrap: [AppComponent]
})
export class AppModule { }
