import { ObjectId } from "mongodb"
import { TweetAudience, TweetType } from "~/models/schemas/tweets.chema"

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPassowrd,
  EmailVerifyToken,
}
export enum mediaType {
  Image,
  Video,
}

interface ErrorWithStatusType {
  message: string,
  status: number
}
export default class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: ErrorWithStatusType) {
    this.message = message,
      this.status = status
  }
}

export interface TweetRequestBody {
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string
  hashtags: string[]
  mentions: string[]
  medias: Media[]
}

export interface FollowBody {
  follow_user_id: string,
}
export interface Media {
  url: string
  type: mediaType
}
export interface VideoStatusType {
  _id?: ObjectId
  name: string
  url: string
  created_at?: Date
  updated_at?: Date
}