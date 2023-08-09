import User from "~/models/schemas/users.schemas"
import databaseServices from "./database.services"

export default class UserServices {
  // login 

  
  async register(payload: { email: string, password: string }) {
    const { email, password } = payload
    const result = await databaseServices.users.insertOne(new User({ email, password }))
    return result
  }

}