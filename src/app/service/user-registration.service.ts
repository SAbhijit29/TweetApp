import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import configurl from '../../assets/config/config.json';
import { AuthGuard } from '../guards/auth-guard.service';
import { userRegistration } from '../Models/UserRegistration';

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService implements OnInit{

  url = configurl.apiServer.url + '/api/v1.0/users/';
  urlLogin = configurl.apiServer.url + '/api/v1.0/login/';
  urlImge = configurl.apiServer.url + '/api/v1.0/user/';

  usr: any;

  constructor(private http: HttpClient,private auth:AuthGuard) { }
  ngOnInit() {
    this.usr = this.auth.getUsername();
  }


  registerUser(userdata: userRegistration): Observable<userRegistration> {
    const httpHeaders = { headers:new HttpHeaders({'Content-Type': 'text/plain'}) };
    return this.http.post<any>(this.url + 'register', userdata, httpHeaders);
  }

  getAllUsers():Observable<any>{
    const httpHeaders = { headers:new HttpHeaders(
      {'Content-Type': 'application/json'}
      ) };
    return this.http.get(this.url+'allUsers',httpHeaders);
  }

  getData(img:any) {
    return this.http.get(img);
  }

  uploadImage(image:any){
    const httpHeaders = { headers:new HttpHeaders(
      {'Content-Type': 'application/json'}
      ) };
      return this.http.put(this.urlImge+"upload/"+image,this.usr,httpHeaders);
  }

}
