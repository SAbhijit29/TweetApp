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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordComponent } from './Component/forgot-password/forgot-password.component';
import { DatePipe } from '@angular/common';
import { TweetsComponent } from './Component/tweets/tweets.component';
import { LeftSidebarComponent } from './Component/left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './Component/right-sidebar/right-sidebar.component';
import { ReplyComponent } from './Component/reply/reply.component';
import { ProfileComponent } from './Component/profile/profile.component';

import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';

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
    HomeComponent,
    ForgotPasswordComponent,
    TweetsComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    ReplyComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,MenuModule,ButtonModule,RippleModule,
    ToastNoAnimationModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:7299","https://tweetapppapi.azurewebsites.net"],
        disallowedRoutes: []
      }
  }),
  ToastrModule.forRoot(),
    FormsModule,
    MatSelectModule,
    MatInputModule,
    BrowserAnimationsModule,
    NgbModule,
    InfiniteScrollModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
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
