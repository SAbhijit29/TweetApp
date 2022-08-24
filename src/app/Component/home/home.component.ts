import { Component, OnInit } from '@angular/core';
import { users } from 'src/app/Models/Users';
import { TweetService } from 'src/app/service/tweet.service';
import { UserRegistrationService } from 'src/app/service/user-registration.service';
import { FormControl } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { tweets } from 'src/app/Models/tweets';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  allUser:users[]=[];
  allTweets:any = [];
  today:Date = new Date();
  PostTweetForm:any;
  flag:boolean = false;
  filteredUser: users[]=[];
  isLike = false;
  colorChange: boolean=false;
  searchTerm = '';

  constructor(private formbulider: FormBuilder,private router:Router,private toastr: ToastrService,private userService: UserRegistrationService,private tweetService:TweetService) { }

  ngOnInit(): void {
    this.getAllUser();
    this.getAllTweets();
 
    this.PostTweetForm = this.formbulider.group({
      tweetText: [null, [Validators.required]],
      tags: [null]
    });
  }

  getAllUser(){
    this.userService.getAllUsers().subscribe({
      next:(res:any)=>{
        this.allUser = res.result;
      },
      error:(err:any)=>console.error(err),
      complete() {
        console.log("get all user completed")
      },
    })
  }

  getAllTweets(){
    this.tweetService.getAllTweets().subscribe({
      next:(res:any)=>{
        this.allTweets = res.result;
        console.log(this.allTweets)
      },
      error:(err:any)=>console.error(err),
      complete() {
        console.log("get all tweets completed")
      },
    })
  }
  autoGrowTextZone(e:any) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 25)+"px";
  }

  postTweet(Tweet:tweets){
    
    this.tweetService.postTweet(Tweet).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.toastr.success(res.message);
        this.getAllTweets();
        this.ClearTweet();
      },
      error:(err:any)=>{
        this.toastr.warning(err.error.message);
        console.error(err)
      },
      complete() {
          console.log("Post Tweeted success");
      }
    })
  }
  ClearTweet(){
    this.PostTweetForm.reset();
  }

  search(value: string) {
    if(value && value.length>0){
      const filteredProducts = this.allUser.filter(filtered=>filtered.username.toLowerCase().includes(value))
      this.filteredUser = filteredProducts;
    }
    else
    this.filteredUser=[];
  }

  likeTweet(tweetId:string){
    debugger
    this.isLike = !this.isLike;
    this.tweetService.liketweet(tweetId).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.toastr.success(res.result);
        this.getAllTweets();
      },error:(err:any)=>console.error(err.error.message),
      complete:()=> {
          //this.isLike=true;
          console.log("Post Tweeted success");
      }
    })
  }

  logOut() {
    localStorage.removeItem("jwt");
    this.router.navigate(['/login']);
  }

}
