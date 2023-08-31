import { TweetRequestBody } from "~/constants/commonType";
import databaseServices from "./database.services";
import { ObjectId, WithId } from "mongodb";
import Tweet from "~/models/schemas/tweets.chema";
import Hashtags from "~/models/schemas/hashtags.schema";

class TweetsServices {
  async checkAndCreateHashtags(hashtags: string[]) {
    const hashtagsDoc = await Promise.all(hashtags.map(async (hashtag) => {
      return databaseServices.hashtags.findOneAndUpdate(
        { name: hashtag },
        {
          $setOnInsert: new Hashtags({ name: hashtag })
        },
        {
          upsert: true,
          returnDocument: "after"
        }
      )
    }))
    return hashtagsDoc.map((hashtag) => (hashtag.value as WithId<Hashtags>)._id)
  }

  async createTweet(user_id: string, tweet: TweetRequestBody) {
    const hashtagsDoc = await this.checkAndCreateHashtags(tweet.hashtags)
    const result = await databaseServices.tweets.insertOne(new Tweet({
      audience: tweet.audience,
      content: tweet.content,
      medias: tweet.medias,
      mentions: tweet.mentions,
      parent_id: new ObjectId(tweet.parent_id as string),
      hashtags: hashtagsDoc,
      type: tweet.type,
      user_id: new ObjectId(user_id),
    }));
    return await databaseServices.tweets.findOne({ _id:result.insertedId });
  }
}

export const tweetsServices = new TweetsServices();