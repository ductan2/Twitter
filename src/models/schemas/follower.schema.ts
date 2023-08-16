import { ObjectId } from "mongodb"

interface followType {
  _id?: ObjectId
  user_id: ObjectId
  create_at?: Date
  followed_user_id: ObjectId
}


export default class Follower {
  _id?: ObjectId
  user_id: ObjectId
  create_at: Date
  followed_user_id: ObjectId

  constructor(followed: followType) {
    this._id = followed._id
    this.create_at = followed.create_at || new Date()
    this.followed_user_id = followed.followed_user_id
    this.user_id = followed.user_id
  }
}



