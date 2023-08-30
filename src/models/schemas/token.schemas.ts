import { config } from "dotenv"
import { ObjectId } from "mongodb"
config()
interface refresh_token_type {
  _id?: ObjectId
  token: string
  create_at?: Date
  user_id: ObjectId
  exp?: number
}

export default class RefreshToken {
  _id?: ObjectId
  token: string
  create_at?: Date
  user_id: ObjectId
  exp?: number
  constructor({ _id, token, create_at, user_id, exp }: refresh_token_type) {
    const refreshExp = process.env.EXPRESIN_REFRESH_TOKEN
    this._id = _id
    this.token = token
    this.create_at = create_at
    this.user_id = user_id
    this.exp = exp || Math.floor(Date.now() / 1000) + Number(refreshExp);
  }
}
