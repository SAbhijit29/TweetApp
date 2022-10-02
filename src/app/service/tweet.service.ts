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

  async getAllTweets():Promise<Observable<any>>{
    const httpHeaders = { headers:new HttpHeaders(
      {'Content-Type': 'application/json'}
      ) };
      return await this.http.get(this.url+'all',httpHeaders).pipe();
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

    async getReply(tweetId:string):Promise<Observable<any>>{
      const httpHeaders = { headers:new HttpHeaders(
        {'Content-Type': 'application/json'}
        ) };
        return await this.http.get(this.url+"GetReplyById/"+tweetId,httpHeaders).pipe();
    }

    postReply(tweet:tweets,tweetId:string):Observable<any>{
      const httpHeaders = { headers:new HttpHeaders(
        {'Content-Type': 'application/json'}
        ) };
        return this.http.post(this.url+this.usr+'/replyToPost/'+tweetId,tweet,httpHeaders);
    }

    getTweetByName(username:string):Observable<any>{
      const httpHeaders = { headers:new HttpHeaders(
        {'Content-Type': 'application/json'}
        ) };
        return this.http.get( configurl.apiServer.url+'/api/v/1.0/tweets/user/search/'+username,httpHeaders);
    }

    deleteTweet(tweetId:string):Observable<any>{
      const httpHeaders = { headers:new HttpHeaders(
        {'Content-Type': 'application/json'}
        ) };
        return this.http.delete(this.url+this.usr+'/delete/'+tweetId,httpHeaders);
    }

    updateTweet(tweetId:string, tweetText:tweets):Observable<any>{
      const httpHeaders = { headers:new HttpHeaders(
        {'Content-Type': 'application/json'}
        ) };
        return this.http.put(this.url+this.usr+'/update/'+tweetId,tweetText,httpHeaders);
    }
}
