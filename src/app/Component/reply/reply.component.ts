import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { tweets } from 'src/app/Models/tweets';
import { TweetService } from 'src/app/service/tweet.service';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {

  id = '';
  reply:string[]=[];
  listReply:any[]=[];
  PostTweetForm:any;
  tweet:any = {
    fullname:"",
    username:"",
    tweetTime:"",
    tweetText:"",
    likedBy: [],
    replyID: [],
    Tags:[]
  }

  noOftext:string=''

  username:any;

  constructor(private formbulider: UntypedFormBuilder,private router: Router,private route: ActivatedRoute,private toastr: ToastrService, private modalService: NgbModal,
    private tweetService:TweetService,private guard:AuthGuard) { }

  ngOnInit(): void {
    this.username = this.guard.getUsername();
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.getReplies(this.id);
    this.PostTweetForm = this.formbulider.group({
      tweetText: [null, [Validators.required,Validators.maxLength(166)]],
      tags: [null,Validators.maxLength(166)]
    });


  }

    async getReplies(tweetId:string){
    this.listReply=[];
    (await this.tweetService.getReply(tweetId)).subscribe({
      next:(res:any)=>{
        if(this.tweet.fullname !== "") this.listReply.push(res.result);
        var result = res.result.replyID;
        if(this.tweet.fullname === "") this.tweet = res.result;
        if((result!=null || result != undefined) && result.length>0){
          result.forEach((element:any) => {
            if(element!=""){
              this.getReplies(element);
            }
          });
        }


      },
      error:(err:any)=>{

      },
      complete:()=> {

       }
    })
  }

  autoGrowTextZone(e:any) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 25)+"px";
  }

  reloadReplys(event:any){
    this.getReplies(this.id)
  }

  postReply(Tweet:tweets,id:string){
    if(Tweet.tweetText == null || this.noOftext.length==0){
      this.toastr.warning("Please enter something..",'',{timeOut: 1000})
      return;
    }
    var twt = Tweet.tweetText.match(/#[a-z0-9_]+/gi);
    var t = Tweet.tweetText.split(/#[a-z0-9_]+/gi);
    var txt = t[0];
    Tweet.tweetText = txt;
    if(twt==null){
      twt=[];
    }
    Tweet.Tags = twt;
    var x = Tweet;


    this.tweetService.postReply(x,id).subscribe({
      next:(res:any)=>{
        this.toastr.success(res.message,'',{timeOut: 1000});
        this.getReplies(this.id);
        this.ClearTweet();
        this.reload();
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
