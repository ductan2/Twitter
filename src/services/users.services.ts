import User, { UpdateInfo, UserVerifyStatus } from "~/models/schemas/users.schemas"
import databaseServices from "./database.services"
import { signToken } from "~/utils/jwt"
import { TokenType } from "~/constants/commonType"
import { checkPassword, hassPassword } from "~/utils/bcrypt"
import RefreshToken from "~/models/schemas/token.schemas"
import { ObjectId } from "mongodb"
import bcrypt from "bcrypt";
import Follower from "~/models/schemas/follower.schema"
import axios from "axios"

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

  private async getOauthGoogleToken(code: string) {
    const body = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code"
    }
    const data = await axios.post("https://oauth2.googleapis.com/token", body, {
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded' // google require this header 
      }
    })
    return data
  }

  private async getGoogleUserInfo(access_token: string, id_token: string) {
    const { data } = await axios.get(
      'https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
      params: {
        access_token,
        alt: "json"
      },
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    }
    )
    return data as {
      id: string,
      email: string,
      access_token: string,
      verified_email: boolean,
      picture: string,
      name: string,
      given_name: string,
      locale: string,
      id_token: string,
    };
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
    await databaseServices.refreshToken.insertOne(new RefreshToken({ token: refresh_token, user_id: new ObjectId(userId), create_at: new Date() }))

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
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await databaseServices.users.findOne({ _id: new ObjectId(userId) })
    if (!user) {
      return {
        message: "User doest not exits!",
        status: 404
      }
    }

    const isMatchPassword = checkPassword(oldPassword, user.password);
    if (!isMatchPassword) {

      return {
        message: "Incorrect old password!",
        status: 400
      }
    }
    await databaseServices.users.updateOne({ _id: new ObjectId(userId) }, {
      $set: {
        password: hassPassword(newPassword),
        updated_at: new Date(),
      }
    })
    return {
      message: "Change password success!",
      status: 200
    }
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
  async follow(user_id: string, followed_user_id: string) {
    const follower = await databaseServices.followers.findOne({ user_id: new ObjectId(user_id), followed_user_id: new ObjectId(followed_user_id) });
    if (!follower) {
      await databaseServices.followers.insertOne(new Follower({ user_id: new ObjectId(user_id), followed_user_id: new ObjectId(followed_user_id) }))
      return {
        message: "Follow success!",
        status: 200,
      }
    }
    return {
      message: "User id already followed!",
      status: 400,
    }
  }
  async unFollow(user_id: string, followed_user_id: string) {

    const user = await databaseServices.users.findOne({ _id: new ObjectId(followed_user_id) })
    if (!user) {
      return {
        message: "User id not found!",
        status: 404,
      }
    }
    const followQuery = { user_id: new ObjectId(user_id), followed_user_id: new ObjectId(followed_user_id) }
    const follower = await databaseServices.followers.findOne(followQuery);

    if (!follower) {
      return {
        message: "You haven't followed this user",
        status: 200,
      }
    }
    await databaseServices.followers.deleteOne(followQuery)
    return {
      message: "Unfollow user success!",
      status: 200,
    }
  }

  async oauth(code: string) {
    const { data } = await this.getOauthGoogleToken(code);
    const { access_token, id_token } = data;
    const userInfo = await this.getGoogleUserInfo(access_token, id_token);
    const { email, verified_email } = userInfo;

    const user = await databaseServices.users.findOne({ email })
    if (user) { // login with google has email already in database 
      // Because not get password from userInfo email so no call function Login 
      const [access_token, refresh_token] = await this.SignAndRefreshToken(user._id.toString(), user.verify)
      await databaseServices.refreshToken.insertOne(new RefreshToken({ token: refresh_token, user_id: new ObjectId(user._id), create_at: new Date() }))
      return {
        access_token, refresh_token, newUser: false,
        verify: user.verify
      }
    }
    else {
      // register with google has email not exits in database
      const password = Math.random().toString(36).substring(2, 15)
      const data = await this.register({
        email: userInfo.email,
        name: userInfo.name,
        date_of_birth: new Date(),
        password,
      })

      return {
        ...data, newUser: true,verify:UserVerifyStatus.Unverified
      }
    }


  }

}

