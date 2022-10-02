import { Component, Input, OnInit, Output,EventEmitter, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { TweetService } from 'src/app/service/tweet.service';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.css']
})
export class TweetsComponent implements OnInit,OnDestroy {

  @Input() tweet:any;
  @Input() isProfile:boolean = false;
  @Output() tweetEmitter = new EventEmitter();
  username:any;
  closeResult=''


  constructor(private router:Router,private auth:AuthGuard, private modalService: NgbModal,private tweetService:TweetService,private toastr: ToastrService) { }
  ngOnDestroy(): void {
    this.isProfile = false;
  }

  ngOnInit(): void {
    this.username = this.auth.getUsername();
    if(this.tweet.tweetText !== ""){
      var regexp = /\#\w\w+\s?/g
      this.tweet.tweetText = this.tweet.tweetText.replace(regexp, '');
    }
  }

  checkTrue(usr:string){
    if(usr === this.username){
      return true;
    }
    return false
  }

  viewProfile(username:string){
     this.router.navigate([`/user/${username}`]).then(() => {
      this.reload();
     });
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

  navigateToNewPage(){
    this.router.navigate([`/tweet/${this.tweet.id}`])
  }


  likeTweet(tweetId:string){
    this.tweetService.liketweet(tweetId).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.toastr.success(res.result,'',{timeOut: 1000});
        this.tweetEmitter.emit('');
        this.reload();
       // window.location.reload();
      },error:(err:any)=>console.error(err.error.message),
      complete:()=> {
          console.log("Liked Tweet!");
      }
    })
  }

  reload(){
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  deleteTweet(tweetId:string) {
    this.tweetService.deleteTweet(tweetId).subscribe({
      next:(res:any)=>{
        this.toastr.success("Post deleted successfully",'',{timeOut: 1000});
        this.modalService.dismissAll();
       this.viewProfile(this.username);
        },
        error:(err:any)=>{
          console.log(err)
        },
        complete:()=> {
          //location.reload();
          this.reload();
         }
    })
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
