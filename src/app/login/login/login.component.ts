import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { userRegistration } from 'src/app/Models/UserRegistration';
import configurl from '../../../assets/config/config.json';
import { BehaviorSubject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  invalidLogin?: boolean;
  registrationForm:any;

  url = configurl.apiServer.url + '/api/v1.0/';
  username: any;
  show: boolean=false;
  password:string=''
  constructor(private router: Router, private http: HttpClient,private jwtHelper : JwtHelperService, private toastr: ToastrService) { }

  ngOnInit(): void {

  }

  showPass()
  {
          this.show = !this.show;
  }

  public login = (form: NgForm) => {

    const credentials = JSON.stringify(form.value);
    this.http.post(this.url +"login", credentials, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe({
      next:(response:any)=>{
        const token = (<any>response).token;
        localStorage.setItem("jwt", token);
        const username = (<any>response).username;
        this.username = username;
        localStorage.setItem("username", username);
        this.invalidLogin = false;
        var str = "Welcome, "+username;
        this.toastr.success(str,'',{timeOut: 1000});
        this.router.navigate([""]);
      },
      error:(err:any)=>{
        this.invalidLogin = true;
        this.toastr.error(err.error,'',{timeOut: 1000});
      },
      complete:()=>{
        const username = this.username;
        localStorage.setItem("username", username);
      }
    })
  }



  isUserAuthenticated() {
    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    else {
      return false;
    }
  }
}
