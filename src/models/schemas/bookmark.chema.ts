import { ObjectId } from "mongodb"

export interface BoookMarkType {
  _id?: ObjectId
  user_id: ObjectId
  tweet_id: ObjectId
  created_at?: Date
}
export class BookMark {
  _id?: ObjectId
  user_id: ObjectId
  tweet_id: ObjectId
  created_at?: Date
  constructor(bookmark: BoookMarkType) {
    this._id = bookmark._id || new ObjectId()
    this.user_id = bookmark.user_id
    this.tweet_id = bookmark.tweet_id
    this.created_at = bookmark.created_at || new Date()
  }
}