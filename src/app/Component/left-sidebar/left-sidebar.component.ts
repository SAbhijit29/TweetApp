import { Component, EventEmitter, OnInit,Output } from '@angular/core';
import { users } from 'src/app/Models/Users';
import { TweetService } from 'src/app/service/tweet.service';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { tweets } from 'src/app/Models/tweets';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from 'src/app/guards/auth-guard.service';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {

  @Output() tweetEmitter = new EventEmitter();
  title = 'TweetApp';
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
  ex: boolean=false;
  count: any;
  o:any[]=[];
  noOftext:string=''

  constructor(private formbulider: UntypedFormBuilder,private auth:AuthGuard,
    private modalService: NgbModal,private router:Router,private toastr: ToastrService,
    private tweetService:TweetService)
   {

   }

  ngOnInit(): void {
    this.PostTweetForm = this.formbulider.group({
      tweetText: [null, [Validators.required]],
      tags: [null]
    });
        this.username = this.auth.getUsername();
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
      if(element == "" || element==null || element.length ==0){
       return
      }
      this.o.push(element.trim());
    });
    var txt = this.o[0];
    Tweet.tweetText = txt;
    if(twt==null){
      twt=[];
    }
    Tweet.Tags = twt;
    var x = Tweet;
    this.tweetService.postTweet(x).subscribe({
      next:(res:any)=>{
        this.toastr.success(res.message,'',{timeOut: 1000});
        this.tweetEmitter.emit('');
        this.ClearTweet();
        this.modalService.dismissAll();
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

  logOut() {
    this.modalService.dismissAll();
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    localStorage.clear();
    this.router.navigate(['/login']).then(()=>{
window.location.reload();
    });
  }


  open(content:any) {
    this.modalService.open(content,
   {ariaLabelledBy: 'modal-basic-title'}).result.then((result)  => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult =
         `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  viewProfile(){
    this.router.navigate([`/user/${this.username}`]).then(() => {
     // window.location.reload();
     this.reload();
    });
  }

  reload(){
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
