import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { userRegistration } from 'src/app/Models/UserRegistration';
import { UserRegistrationService } from 'src/app/service/user-registration.service';
import configurl from '../../../assets/config/config.json';

import{users} from 'src/app/Models/Users'
import { TweetService } from 'src/app/service/tweet.service';
import { tweets } from 'src/app/Models/tweets';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  registrationForm:any;
  PostTweetForm:any;
  url = configurl.apiServer.url + '/api/v1.0/';

  user?:users[];
  allUser?:users[];
  allTweets?:tweets[];
  showAllTweets:boolean=false;

  showuser:boolean=false;
  token: string | null="";
  username:string | null="";

  show: boolean=false;
  password:string=''
  constructor(private formbulider: UntypedFormBuilder, private toastr: ToastrService,private router: Router,private http: HttpClient ,private userservice:UserRegistrationService   ) { }

  ngOnInit(): void {

    this.registrationForm = this.formbulider.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.maxLength(10)]],
      
    });

  }

  
  showPass()
  {
          this.show = !this.show;
  }
  
  postUser(user: userRegistration) {
          if (this.registrationForm.invalid) {
            this.toastr.error("Invalid Form",'',{timeOut: 1000})
            return;
        }

    const user_Master = JSON.stringify(user);
    this.http.post(this.url +"users/register", user,{
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
    }).subscribe({
        next:(res:any)=>{
          if(res.statusCode==200){
            this.toastr.success(res.message,'',{timeOut: 1000});
            this.router.navigate(['/login']);
          }
          else{
            this.toastr.error(res.message,'',{timeOut: 1000});
          }
          
        },
        error:(err)=>{
          console.log(err)
          if(err.error.errors.Username!= null){
            this.toastr.error(err.error.errors.Username,'',{timeOut: 1000});
          }
          else if(err.error.errors.Password!= null){
            this.toastr.error(err.error.errors.Password,'',{timeOut: 1000});
          }
          else if(err.error.errors.Email!= null){
            this.toastr.error(err.error.errors.Email,'',{timeOut: 1000});
          }
          else if(err.error.errors.ConfirmPassword!= null){
            this.toastr.error(err.error.errors.ConfirmPassword,'',{timeOut: 1000});
          }
          else
          this.toastr.error(...err.error.title,'',{timeOut: 1000})
        },
        complete() {
            console.log("complete")
        },
      })
  }

  Clear(user: userRegistration){
    this.registrationForm.reset();
  }

  getallUser(){
    this.userservice.getAllUsers().subscribe({
      next:(res:any)=>{
        this.allUser = res.result;
        this.user = this.allUser;
        this.showuser=true;
       //console.log(res)
      },
      error:(err:any)=>console.error(err),
      complete() {
        console.log("get all user completed")
      },
    })
  }

}
