import { BookMark } from "~/models/schemas/bookmark.chema";
import databaseServices from "./database.services";
import { ObjectId } from "mongodb";

class BookMarkServices {
  async bookMarkTweet(tweetId: string, user_id: string) {
    return await databaseServices.bookmark.findOneAndUpdate({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweetId)
    }, {
      $setOnInsert: new BookMark({
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweetId)
      })
    },
      { upsert: true ,returnDocument:"after"})
  }
}

export const bookMarkServices = new BookMarkServices();