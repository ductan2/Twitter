import User from "~/models/schemas/users.schemas"
import databaseServices from "./database.services"

export default class UserServices {
  async register(payload: { name: string, email: string, password: string, date_of_birth: Date }) {

    const result = await databaseServices.users.insertOne(new User({
      ...payload,
      date_of_birth: new Date(payload.date_of_birth)
    }))
    return result
  };
  async checkEmailExits(email: string) {
    const user = await databaseServices.users.findOne({ email })
    return Boolean(user) // user !== undefined or null ,it return true otherwise return null
  }
}