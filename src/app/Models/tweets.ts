import { DatePipe } from "@angular/common";

export class tweets{
    // public string Id { get; set; }

    // [MaxLength(144, ErrorMessage ="Limit reached for tweet message")]
    // public string TweetText { get; set; }
    // public DateTime TweetTime { get; set; }

    // public string Username { get; set; }
    // public int Likes { get; set; }

    // [MaxLength(50, ErrorMessage = "Limit reached for tweet message")]
    // public string Tags { get; set; }

    Id?:string;
    TweetText?:string;
    TweetTime?:DatePipe;
    Username?:string;
    Likes?:Number;
    Tags?:string;
}