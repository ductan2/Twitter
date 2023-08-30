import { checkSchema } from "express-validator";
import { isEmpty } from "lodash";
import { ObjectId } from "mongodb";
import { Media, mediaType } from "~/constants/commonType";
import { TweetAudience, TweetType } from "~/models/schemas/tweets.chema";
import { numberEnumToArray } from "~/utils/common";


const tweetTypes = numberEnumToArray(TweetType)
const tweetAudiences = numberEnumToArray(TweetAudience)
const mediaTypes = numberEnumToArray(mediaType)
export const createTweetValidator = checkSchema({
  type: {
    isIn: {
      options: [tweetTypes],
    },
    errorMessage: `type must be one of ${tweetTypes.join(", ")}`,
  },
  audience: {
    isIn: {
      options: [tweetAudiences],
    },
    errorMessage: `audience must be one of ${tweetAudiences.join(", ")}`,
  },
  parent_id: {
    custom: {
      options: (value, { req }) => {
        const type = req.body.type as TweetType
        if ([TweetType.Comment, TweetType.Retweet, TweetType.QuoteTweet].includes(type) && !value) {
          throw new Error("parent_id is must be a valid tweet id")
        }
        if (type === TweetType.Tweet && value) {
          throw new Error("parent_id is not valid for tweet type")
        }
        return true;
      }
    }
  },
  content: {
    isString: true,
    custom: {
      options: (value, { req }) => {
        const type = req.body.type as TweetType
        const hashtags = req.body.hashtags as string[]
        const mentions = req.body.mentions as string[]
        if ([TweetType.Comment, TweetType.Retweet, TweetType.QuoteTweet].includes(type) && !value && isEmpty(hashtags) && isEmpty(mentions)) {
          throw new Error("content is required for comment, retweet and quote tweet")
        }
        if (type === TweetType.Retweet && value !== '') {
          throw new Error("Content must be empty string")
        }
        return true;
      }
    }
  },
  hashtags: {
    isArray: true,
    custom: {
      options: (value: string[], { req }) => {
        if (value.some((item: any) => typeof item !== 'string')) {
          throw new Error("hashtags must be array of string")
        }
        return true
      }
    }
  },
  mentions: {
    isArray: true,
    custom: {
      options: (value: string[], { req }) => {
        if (value.some((item: any) => !ObjectId.isValid(item))) {
          throw new Error("mentions must be array of object id")
        }
        return true;
      }
    }
  },
  medias: {
    isArray: true,
    custom: {
      options: (value: string[], { req }) => {
        if (value.some((item: any) => {
          return typeof item.url !== 'string' && !mediaTypes.includes(item.type)
        })) {
          throw new Error("medias must be array of object id")
        }
        return true;
      }
      
    }
  }
}, ["body"])