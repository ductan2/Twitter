import { ObjectId } from "mongodb";

interface hashtagsType{
  _id?: ObjectId;
  name:string
  created_at?: Date;
}

export default class Hashtags {
  _id?: ObjectId;
  name:string
  created_at?: Date;
  constructor(hashtags:hashtagsType) {
    const date = new Date();
    this._id = hashtags._id || new ObjectId();
    this.name = hashtags.name;
    this.created_at = hashtags.created_at || date;
  }
}