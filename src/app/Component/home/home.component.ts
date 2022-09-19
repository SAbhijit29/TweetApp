import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { users } from 'src/app/Models/Users';
import { TweetService } from 'src/app/service/tweet.service';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { tweets } from 'src/app/Models/tweets';
import { ToastrService } from 'ngx-toastr';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  o:any[]=[];
  msg='';
  reply:string[]=[];
  listReply:any[]=[];
  allUser:users[]=[];
  allTweets:tweets[] = [];
  today:Date = new Date();
  PostTweetForm:any;
  flag:boolean = false;
  filteredUser: users[]=[];
  isLike = false;
  colorChange: boolean=false;
  searchTerm = '';
  closeResult = '';
  username:any;

  myValueSub: Subscription = new Subscription();


  constructor(private formbulider: UntypedFormBuilder,private auth:AuthGuard,
    private modalService: NgbModal,private toastr: ToastrService,
    private tweetService:TweetService, private guard:AuthGuard,private router:Router)
   {

   }

  ngOnDestroy() {
      if (this.myValueSub) {
          this.myValueSub.unsubscribe();
    }
  }

  ngOnInit(): void {
  this.getAllTweets();
    this.PostTweetForm = this.formbulider.group({
      tweetText: [null, [Validators.required]],
      tags: [null]
    });
        this.username = this.auth.getUsername();
     this.auth.content.subscribe((res:any)=>
      res
      )

  }


  getAllTweets(){
    this.myValueSub = this.tweetService.getAllTweets().subscribe({
      next:(res:any)=>{

       if(res.result != null && res.result.length>0){
        this.allTweets = res.result;
        this.allTweets.sort();
       }else{
        this.msg = "No tweets found.."
        this.allTweets=[];
       }
      },
      error:(err:any)=>console.error(err),
      complete() {
        console.log("get all tweets completed")
      },
    })
  }


  reloadTweets(event:any){
    this.getAllTweets();
  }

  autoGrowTextZone(e:any) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 25)+"px";
  }

  postTweet(Tweet:tweets){

    if(Tweet.tweetText==null || Tweet.tweetText==""){
      this.toastr.warning("Enter some text to post",'',{timeOut: 1000})
      return
    }

    this.o =[];
    var twt = Tweet.tweetText.match(/#[a-z0-9_]+/gi);
    var t = Tweet.tweetText.split(/#[a-z0-9_]+/gi);
    t.forEach(element => {
      if(element == "" || element.length ==0|| element==null){
       return
      }
      this.o.push(element.trim());
    });
    var txt = this.o[0];
    Tweet.tweetText = txt;
    Tweet.Tags = twt;
    var x = Tweet;
    this.tweetService.postTweet(x).subscribe({
      next:(res:any)=>{
        this.toastr.success(res.message,'',{timeOut: 1000});
        this.getAllTweets();
        this.reload();
        this.ClearTweet();
        this.modalService.dismissAll();
      },
      error:(err:any)=>{
        this.toastr.warning(err.error.message,'',{timeOut: 1000});
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
  reload(){
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }


}
