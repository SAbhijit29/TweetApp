import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { userRegistration } from 'src/app/Models/UserRegistration';
import { UserRegistrationService } from 'src/app/service/user-registration.service';
import configurl from '../../../assets/config/config.json';

import{users} from 'src/app/Models/Users'
import { Observable } from 'rxjs';
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

  constructor(private formbulider: FormBuilder, private jwtHelper : JwtHelperService,private tweetService:TweetService
    ,private toastr: ToastrService,private router: Router,private http: HttpClient ,private userservice:UserRegistrationService   ) { }

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


    this.PostTweetForm = this.formbulider.group({
      tweetText: ['', [Validators.required]],
      tags: [null]
    });

    
    this.isUserAuthenticated();
    this.token = localStorage.getItem("jwt");
    this.username = localStorage.getItem("username");
  }

  
  postTweet(Tweet:tweets){
    this.tweetService.postTweet(Tweet).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.toastr.success(res.message);
      },
      error:(err:any)=>console.error(err),
      complete() {
          console.log("Post Tweeted success");
      }
    })
  }

  ClearTweet(user: userRegistration){
    this.PostTweetForm.reset();
  }

  
  postUser(user: userRegistration) {
      //const user_Master = this.registrationForm.value;
    const user_Master = JSON.stringify(user);
    this.http.post(this.url +"users/register", user,{
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
    }).subscribe({
        next:(res:any)=>{
          console.log(res)
          this.toastr.success(res.message);
          this.router.navigate(['/login']);
        },
        error:(err)=>{
          console.log(err)
          this.toastr.error(err.error.title);
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

  getalltweets(){
    this.tweetService.getAllTweets().subscribe({
      next:(res:any)=> {
          this.allTweets = res.result;
          this.showAllTweets = true;
      },
      error:(err:any)=>console.error(err),
      complete() {
          console.log("all tweets received");
      },
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
