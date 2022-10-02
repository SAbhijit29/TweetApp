import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MenuItem } from 'primeng/api';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { tweets } from 'src/app/Models/tweets';
import { TweetService } from 'src/app/service/tweet.service';
import { UserRegistrationService } from 'src/app/service/user-registration.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username:string = '';
  user:any={
    fullname: "",
    joinedDate: "",
    phone: 9999999999,
    username: ""
  }
  items: MenuItem[]=[] ;

  tweets:any = [];
  closeResult='';
  editId:any='';
  PostTweetForm: any;
  usr:any;
  showBtn:boolean=false;
  image : any;
  msg='';

  constructor(private route: ActivatedRoute,private auth:AuthGuard,private http:HttpClient,private router: Router,
    private formbuilder:UntypedFormBuilder, private modalService: NgbModal,private userService: UserRegistrationService,private tweetService:TweetService) { }

  ngOnInit(): void {
    this.usr = this.auth.getUsername();
    this.route.params.subscribe(params => {
      this.username = params['username'];
    });

  //   this.router.events.subscribe((val) => {
  //     // see also
  //     debugger
  //     console.log(val instanceof NavigationEnd)
  //     this.route.params.subscribe(params => {
  //       debugger
  //       this.username = params['username'];

  //     });

  // });

  this.getUserDetails();
  this.getTweetsByUser();

    this.PostTweetForm = this.formbuilder.group({
      tweetText: [null, [Validators.required,Validators.maxLength(166)]],
      tags: [null,Validators.maxLength(166)]
    });

    if(this.username === this.usr){
      this.showBtn = true;
    }
  }


  updateTweet(tweetText:tweets) {
    var tags =  tweetText.tweetText.match(/#[a-z0-9_]+/gi);

    var twt = new tweets();
    twt.Tags = tags;
    twt.tweetText = tweetText.tweetText;
    twt.id=this.editId;

    this.tweetService.updateTweet(this.editId, twt).subscribe({
      next:(res:any)=>{
        this.modalService.dismissAll();
        this.getUserDetails();
    this.getTweetsByUser();
    window.location.reload();
   // this.reload();
        },
        error:(err:any)=>{
          console.log(err)
        },
        complete:()=> {
         }
    })
}

reload(){
  let currentUrl = this.router.url;
  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  this.router.onSameUrlNavigation = 'reload';
  this.router.navigate([currentUrl]);
}

autoGrowTextZone(e:any) {
  e.target.style.height = "0px";
  e.target.style.height = (e.target.scrollHeight + 25)+"px";
}

open(content:any, tweet:any) {
  this.modalService.open(content,
 {ariaLabelledBy: 'modal-basic-title'}).result.then((result)  => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult =
       `Dismissed ${this.getDismissReason(reason)}`;
  });
   this.editId = tweet.id;
  this.PostTweetForm.patchValue({
    tweetText : tweet.tweetText + tweet?.tags,
    tags :tweet.tags
  });
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

  getTweetsByUser(){
    this.tweetService.getTweetByName(this.username).subscribe({
      next:(res:any)=>{
      if(res && res.result && res.result.length>0){
        this.tweets.push(...res.result);
      }
      else{
        this.msg = "No tweets yet Posted.."
        this.tweets =[];
      }

      },
      error:(err:any)=>{
        console.log(err)
      },
      complete:()=> {
       }
    })
  }

  reloadTweets(event:any){
    this.getTweetsByUser();
  }

  getUserDetails(){
    this.userService.getUserByName(this.username).subscribe({
      next:(res:any)=>{
      if(res && res.result){
        this.user = res.result;
      }
      },
      error:(err:any)=>{
        console.log(err)
      },
      complete:()=> {

       }
    })
  }

}
