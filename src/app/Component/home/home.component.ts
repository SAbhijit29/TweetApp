import { Component, OnInit,Sanitizer } from '@angular/core';
import { users } from 'src/app/Models/Users';
import { TweetService } from 'src/app/service/tweet.service';
import { UserRegistrationService } from 'src/app/service/user-registration.service';
import { FormControl } from '@angular/forms';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { tweets } from 'src/app/Models/tweets';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { DomSanitizer } from "@angular/platform-browser";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  reply:string[]=[];
  listReply:any[]=[];
  allUser:users[]=[];
  allTweets:tweets[] = [];
  today:Date = new Date();
  PostTweetForm:any;
  imageUpload:any;
  flag:boolean = false;
  filteredUser: users[]=[];
  isLike = false;
  colorChange: boolean=false;
  searchTerm = '';
  closeResult = '';
  username:any;
  ex: boolean=false;
  count: any;
  BmdFile_strbase64 : any;
  dwnImg: any;
  im: any;

  constructor(private formbulider: UntypedFormBuilder,private auth:AuthGuard,
    private modalService: NgbModal,private router:Router,private toastr: ToastrService,
    private userService: UserRegistrationService,private tweetService:TweetService,private sanitizer: DomSanitizer)
   { 
    
   }

  ngOnInit(): void {
    this.getAllUser();
    this.getAllTweets();
    
    this.PostTweetForm = this.formbulider.group({
      tweetText: [null, [Validators.required]],
      tags: [null]
    });

    this.imageUpload = this.formbulider.group({
      image: ['']
    })
        this.username = this.auth.getUsername();
     this.auth.content.subscribe((res:any)=>
      console.log(res)
      )
  }

  uploadImage(image:any){
    debugger
    this.userService.uploadImage(image).subscribe({
      next:(res:any)=>{
        console.log(res);
      },
      error:(err:any)=>{
        console.log(err);
      },
      complete:()=>{
        console.log("upload image");
      }
    })
  }
  downloadImage(image:any){
    if(image!=null){
    let objectURL = 'data:image/jpeg;base64,' + image;
    let img = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
   // console.table(img);
    this.dwnImg = img;
    return this.dwnImg;
  }
  }

  getAllUser(){
    
    this.userService.getAllUsers().subscribe({
      next:(res:any)=>{
        if(res.result!=null)
       {
        this.allUser = res.result;

        this.allUser.forEach(element => {
          var x =this.downloadImage(element.image);
          element.image = x;
          this.im = element.image;
          element.image = null;
        });

       } else{
        this.allUser=[];
       }

      },
      error:(err:any)=>console.error(err),
      complete() {
        console.log("get all user completed")
      },
    })
  }

  checkLiked(likedBy:any){

    if(likedBy!=null){
      if(likedBy.find((x:any)=>x.match(this.username))!== undefined){
        return true;
      }
      return false;
    }
   
    return false;
  }
  

  getAllTweets(){
    this.tweetService.getAllTweets().subscribe({
      next:(res:any)=>{
       if(res.result != null){
        this.allTweets = res.result;
        console.log(this.allTweets)
       }else{
        this.allTweets=[];
       }
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
        this.modalService.dismissAll();
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
    this.tweetService.liketweet(tweetId).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.toastr.success(res.result);
        this.getAllTweets();
      },error:(err:any)=>console.error(err.error.message),
      complete:()=> {
          console.log("Post Tweet success");
      }
    })
  }

  getReplies(tweetId:string){
    this.listReply=[];
    this.tweetService.getReply(tweetId).subscribe({
      next:(res:any)=>{
        console.log(res);
      
         this.listReply.push(res.result);
        var result = res.result.replyID;
        if(result!=null || result != undefined){
          result.forEach((element:any) => {
            if(element!=""){
              this.reply.push(element);
              this.getReplies(element);
            }
          });
        }
        console.log(this.listReply);
      },
      error:(err:any)=>{
        
      },
      complete:()=> {
       // this.listReply;
;      }
    })
  }

  logOut() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    localStorage.clear();
    this.router.navigate(['/login']);
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
