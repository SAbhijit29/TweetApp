import { DatePipe } from "@angular/common";

export class tweets{
    id:string="";
    tweetText:string="";
    tweetTime:Date=new Date();
    username:string="";
    likes:Number=0;
    Tags:string="";
    fullname:string="";
    likedBy:string[]=[];
}