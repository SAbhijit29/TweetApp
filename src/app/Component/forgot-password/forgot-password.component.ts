import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import configurl from '../../../assets/config/config.json';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  urlLogin = configurl.apiServer.url + '/api/v1.0/login/';
  show: boolean=false;
  password:string=''
  confirmPassword:string='';


  constructor(private router: Router, private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  public forgot = (form: NgForm) => {

    if(this.password != this.confirmPassword){
      this.toastr.warning("Password and confirm password does not match!")
      return
    }
    const credentials = JSON.stringify(form.value);
    console.log(credentials)
    this.http.put(this.urlLogin +"forgotPassword/", credentials, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe((response:any) => {

     if(response.statusCode == 404){
      this.toastr.error('User with email not found','',{timeOut:1000})
      this.router.navigate(["/forgotPassword"]);
      return;
     }
     this.toastr.success(response.message,'',{timeOut: 1000});
     this.router.navigate(["/login"]).then(()=>{
      this.reload();
     })
     //window.location.reload();
    }, err => {
            this.toastr.error(err,'',{timeOut: 1000});
    });
  }
  reload(){
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
  showPass()
  {
          this.show = !this.show;
  }
}
