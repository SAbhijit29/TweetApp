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


  constructor(private router: Router, private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  public forgot = (form: NgForm) => {
    const credentials = JSON.stringify(form.value);
    this.http.put(this.urlLogin +"forgotPassword/", credentials, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe((response:any) => {
     console.log(response);
      this.toastr.success(response.message);
      this.router.navigate(["/login"]);
    }, err => {
            this.toastr.error(err);
    });
  }
}
