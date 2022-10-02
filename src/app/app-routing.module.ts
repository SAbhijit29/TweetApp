import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './Homepage/homepage/homepage.component';
import { LoginComponent } from './login/login/login.component';
import { SignupComponent } from './signup/signup/signup.component';
import { HomeComponent } from './Component/home/home.component';
import { AuthGuard } from './guards/auth-guard.service';
import { ForgotPasswordComponent } from './Component/forgot-password/forgot-password.component';
import { ReplyComponent } from './Component/reply/reply.component';
import { ProfileComponent } from './Component/profile/profile.component';

const routes: Routes = [
  { path: '',  component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'registration', component: SignupComponent },
  { path: 'login', component: LoginComponent },

  { path: 'homepage', component: HomepageComponent,canActivate: [AuthGuard] },
  { path:'forgotPassword', component:ForgotPasswordComponent},
  { path:'tweet/:id', component:ReplyComponent,canActivate: [AuthGuard]},
  { path:'user/:username', component:ProfileComponent,canActivate: [AuthGuard]},
  { path: '**', redirectTo: '' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
