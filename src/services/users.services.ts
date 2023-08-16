import User, { UpdateInfo, UserVerifyStatus } from "~/models/schemas/users.schemas"
import databaseServices from "./database.services"
import { signToken } from "~/utils/jwt"
import { TokenType } from "~/constants/enums"
import { hassPassword } from "~/utils/bcrypt"
import RefreshToken from "~/models/schemas/token.schemas"
import { ObjectId } from "mongodb"
import bcrypt from "bcrypt";

export default class UserServices {
  private signAccessToken(userId: string, verify: UserVerifyStatus) {

    return signToken({
      payload: {
        userId,
        tokenType: TokenType.AccessToken,
        verify
      },
      options: {
        expiresIn: process.env.EXPRESIN_ACCESS_TOKEN,
        algorithm: "RS256"
      }
    })
  }
  private signRefreshToken(userId: string, verify: UserVerifyStatus) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.RefreshToken,
        verify
      },
      options: {
        expiresIn: process.env.EXPRESIN_REFRESH_TOKEN,
        algorithm: "RS256"
      }
    })
  }
  private signEmailVerifyToken(user_id: string, verify: UserVerifyStatus) {
    return signToken({
      payload: {
        user_id,
        tokenType: TokenType.EmailVerifyToken,
        verify
      },
      privatekey: process.env.JWT_EMAIL_VERIFY,
      options: {
        expiresIn: process.env.EXPRESIN_EMAIL_VERIFY,
        algorithm: "RS256"
      }
    })
  }
  private signForgotPasswordToken(userId: string, verify: UserVerifyStatus) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.ForgotPassowrd,
        verify
      },
      privatekey: process.env.JWT_FORGOT_PASSWORD,
      options: {
        expiresIn: process.env.EXPRESIN_FORGOT_PASSWORD,
        algorithm: "RS256"
      }
    })
  }

  SignAndRefreshToken(userId: string, verify: UserVerifyStatus) {
    return Promise.all([
      this.signAccessToken(userId, verify),
      this.signRefreshToken(userId, verify), // running in parallel(song song) 
    ])
  }
  async checkEmailExits(email: string) {
    const user = await databaseServices.users.findOne({ email })
    return Boolean(user) // user !== undefined or null ,it return true otherwise return null
  }
  async register(payload: { name: string, email: string, password: string, date_of_birth: Date }) {
    const user_id = new ObjectId();
    const email_verify_token = await this.signEmailVerifyToken(user_id.toString(), UserVerifyStatus.Unverified);
    await databaseServices.users.insertOne(new User({
      ...payload,
      _id: user_id,
      email_verify_token,
      date_of_birth: new Date(payload.date_of_birth),
      password: hassPassword(payload.password)
    }))

    const [access_token, refresh_token] = await this.SignAndRefreshToken(user_id.toString(), UserVerifyStatus.Unverified)
    console.log("email verify token", email_verify_token)
    await databaseServices.refreshToken.insertOne(new RefreshToken({ token: refresh_token, user_id: new ObjectId(user_id), create_at: new Date() }))
    return {
      access_token,
      refresh_token
    }
  };

  async login(payload: { email: string, password: string, verify: UserVerifyStatus }) {
    const { email, password, verify } = payload

    const user = await databaseServices.users.findOne({ email })
    const passwordMatch = await bcrypt.compare(password, user?.password);
    if (passwordMatch) {
      const userId = user?._id.toString();
      const [access_token, refresh_token] = await this.SignAndRefreshToken(userId as string, verify)
      await databaseServices.refreshToken.insertOne(new RefreshToken({ token: refresh_token, user_id: new ObjectId(userId), create_at: new Date() }))
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
  async verifyEmail(userId: string) {

    const [token] = await Promise.all([
      this.SignAndRefreshToken(userId, UserVerifyStatus.Verified),
      databaseServices.users.updateOne({
        _id: new ObjectId(userId)
      }, {
        $set: {
          email_verify_token: '',
          verify: UserVerifyStatus.Verified,
          updated_at: new Date()
        }
      })
    ])
    const [access_token, refresh_token] = token
    return {
      access_token,
      refresh_token
    }
  }

  async resendVerifyEmail(userId: string) {
    const email_verify_token = await this.signEmailVerifyToken(userId, UserVerifyStatus.Unverified);
    console.log("resend email", email_verify_token)

    await databaseServices.users.updateOne({
      _id: new ObjectId(userId)
    }, {
      $set: {
        email_verify_token,
        updated_at: new Date()
      }
    })
  }
  async forgotPassword(email: string, verify: UserVerifyStatus) {
    const user = await databaseServices.users.findOne({ email });
    const userId = user?._id;

    const forgot_password_token = await this.signForgotPasswordToken(userId?.toString() as string, verify);
    await databaseServices.users.updateOne({
      _id: new ObjectId(userId),
    }, {
      $set: {
        forgot_password_token,
        updated_at: new Date()
      }
    })
    console.log("forgot password token:  ", forgot_password_token);
    // gửi link có dạng : https://domain/forgot-password?token=token
    return {
      message: "Check your email for password reset instructions",
    }
  }
  async resetPassword(userId: string, password: string) {
    await databaseServices.users.updateOne({
      _id: new ObjectId(userId),
    }, {
      $set: {
        password: hassPassword(password),
        forgot_password_token: '',
        updated_at: new Date()
      }
    })
  }
  async getInfo(userId: string) {
    const user = await databaseServices.users.findOne({ _id: new ObjectId(userId) }, {
      projection: {
        password: 0,
        email_verify_token: 0,
        forgot_password_token: 0,
      }
    })
    return user;
  }
  async updateInfo(userId: string, payload: UpdateInfo) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    const user = await databaseServices.users.findOneAndUpdate({
      _id: new ObjectId(userId)
    }, {
      $set: {
        ..._payload, updated_at: new Date()
      }
    })
    return user;
  }
}