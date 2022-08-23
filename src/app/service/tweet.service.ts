import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import configurl from '../../assets/config/config.json';
import { tweets } from '../Models/tweets';

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  url = configurl.apiServer.url + '/api/v1.0/tweets/';
  username: string | null;

  

  constructor(private http: HttpClient) {
    this.username = localStorage.getItem("username");
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
        return this.http.post(this.url+this.username+"/add",tweet,httpHeaders);
    }
    liketweet(tweetId:string,res:boolean):Observable<any>{
      const httpHeaders = { headers:new HttpHeaders(
        {'Content-Type': 'application/json'}
        ) };
        return this.http.patch(this.url+tweetId+"/update/"+res,httpHeaders);
    }
}
