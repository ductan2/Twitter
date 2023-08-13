import User from "~/models/schemas/users.schemas"
import databaseServices from "./database.services"
import { signToken } from "~/utils/jwt"
import { TokenType } from "~/constants/enums"
import { hassPassword } from "~/utils/bcrypt"
import RefreshToken from "~/models/schemas/token.schemas"
import { ObjectId } from "mongodb"
import bcrypt from "bcrypt";
export default class UserServices {
  private signAccessToken(userId: string) {
    const expiresIn = '3600';
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.AccessToken
      },
      options: {
        expiresIn: expiresIn,
        algorithm: "RS256"
      }
    })
  }
  private signRefreshToken(userId: string) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.RefreshToken
      },
      options: {
        expiresIn: '3600000',
        algorithm: "RS256"
      }
    })
  }
  SignAndRefreshToken(userId: string) {
    return Promise.all([
      this.signAccessToken(userId),
      this.signRefreshToken(userId), // running in parallel(song song) 
    ])
  }
  async checkEmailExits(email: string) {
    const user = await databaseServices.users.findOne({ email })
    return Boolean(user) // user !== undefined or null ,it return true otherwise return null
  }
  async register(payload: { name: string, email: string, password: string, date_of_birth: Date }) {
    const result = await databaseServices.users.insertOne(new User({
      ...payload,
      date_of_birth: new Date(payload.date_of_birth),
      password: hassPassword(payload.password)
    }))
    const userId = result.insertedId.toString();
    const [access_token, refresh_token] = await this.SignAndRefreshToken(userId)

    await databaseServices.refreshToken.insertOne(new RefreshToken({ token: refresh_token, user_id: new ObjectId(userId) }))
    return {
      access_token,
      refresh_token
    }
  };

  async login(payload: { email: string, password: string }) {
    const { email, password } = payload
    const user = await databaseServices.users.findOne({ email })
    const passwordMatch = await bcrypt.compare(password, user?.password);
    if (passwordMatch) {
      const userId = user?._id.toString();
      const [access_token, refresh_token] = await this.SignAndRefreshToken(userId as string)
      await databaseServices.refreshToken.insertOne(new RefreshToken({ token: refresh_token, user_id: new ObjectId(userId) }))
      return {
        access_token, refresh_token
      }
    }
    else {
      throw new Error("Email or Password is does match")
    }
  }
  async logout(refresh_token: string) {
    const result = await databaseServices.refreshToken.deleteOne({ token: refresh_token })
    return {
      message: "Logout successfully!",
      status: 200,
    }

  }

}