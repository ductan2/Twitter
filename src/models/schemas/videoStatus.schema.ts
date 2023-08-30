import { ObjectId } from "mongodb";
import {  VideoStatusType } from "~/constants/commonType";

export default class VideoStatus {
  _id?: ObjectId
  name: string
  url :string
  created_at?: Date
  updated_at?: Date
  constructor({ name,url }: VideoStatusType) {
    const date = new Date()
    this._id = new ObjectId()
    this.name = name || ''
    this.url = url || ''
    this.created_at =  date
    this.updated_at =  date
  }
}