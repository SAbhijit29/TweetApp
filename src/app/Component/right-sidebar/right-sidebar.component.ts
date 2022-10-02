import { Component, OnInit } from '@angular/core';
import { users } from 'src/app/Models/Users';
import { UserRegistrationService } from 'src/app/service/user-registration.service';
import { tweets } from 'src/app/Models/tweets';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css']
})
export class RightSidebarComponent implements OnInit {

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
  msg:string=''
  Nomsg:string='';
  username:any;
  ex: boolean=false;
  count: any;
  BmdFile_strbase64 : any;
  dwnImg: any;

  constructor(private userService: UserRegistrationService,private router:Router,private sanitizer: DomSanitizer)
   {

   }

  ngOnInit(): void {
    this.getAllUser();
  }

  viewProfile(username:string){
    this.router.navigate([`/user/${username}`]).then(() => {
      this.reload();
    });
  }

  reload(){
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  downloadImage(image:any){
    if(image!=null){
    let objectURL = 'data:image/jpeg;base64,' + image;
    let img = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
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
       } else{
        this.Nomsg="No user found";
        this.allUser=[];
       }
      },
      error:(err:any)=>console.error(err),
      complete() {
        console.log("get all user completed")
      },
    })
  }

  search(value: string) {
    if(value && value.length>0){
      const filteredProducts = this.allUser.filter(filtered=>filtered.username.toLowerCase().includes(value))
      if(filteredProducts.length ==0){
        this.msg="No user found";
        this.filteredUser=[];
      }
      else{
        this.msg=''
        this.filteredUser = filteredProducts;
      }
    }
    else{
      this.msg=''
      this.filteredUser=[];
    }
  }
}
