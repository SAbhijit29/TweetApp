import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import configurl from '../../assets/config/config.json';
import { AuthGuard } from '../guards/auth-guard.service';
import { tweets } from '../Models/tweets';
import { BehaviorSubject } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class TweetService implements OnInit {

  url = configurl.apiServer.url + '/api/v1.0/tweets/';
  username:any;
  usr: any;


  constructor(private http: HttpClient, private auth:AuthGuard) {
   this.auth.content.subscribe((res:any)=>
   this.usr = res
   )
   }
  ngOnInit(): void {
    this.usr = this.auth.getUsername();
  }

  getAllTweets():Observable<any>{
    const httpHeaders = { headers:new HttpHeaders(
      {'Content-Type': 'application/json'}
      ) };
      return this.http.get(this.url+'all',httpHeaders);
    }

    postTweet(tweet:tweets):Observable<any>{
      const httpHeaders = { headers:new HttpHeaders(
        {'Content-Type': 'application/json'}
        ) };
        return this.http.post(this.url+this.usr+"/add",tweet,httpHeaders);
    }

    liketweet(tweetId:string):Observable<any>{
      const httpHeaders = { headers:new HttpHeaders(
        {'Content-Type': 'application/json'}
        ) };
        return this.http.patch(this.url+tweetId+"/update/"+this.usr,httpHeaders);
    }

    getReply(tweetId:string):Observable<any>{
      const httpHeaders = { headers:new HttpHeaders(
        {'Content-Type': 'application/json'}
        ) };
        return this.http.get(this.url+"GetReplyById/"+tweetId,httpHeaders);
    }
}
