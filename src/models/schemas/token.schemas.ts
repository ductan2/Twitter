import { ObjectId } from "mongodb"

interface refresh_token_type {
  _id?: ObjectId
  token: string
  create_at?: Date
  user_id: ObjectId
}

export default class RefreshToken {
  _id?: ObjectId
  token: string
  create_at?: Date
  user_id: ObjectId
  constructor({ _id, token, create_at, user_id }: refresh_token_type) {
    this._id = _id,
      this.token = token,
      this.create_at = create_at,
      this.user_id = user_id
  }
}
