import { Request, Response } from "express"
import { ParamsDictionary } from "express-serve-static-core"
import { JwtPayload } from "jsonwebtoken"
import { TweetRequestBody } from "~/constants/commonType"
import databaseServices from "~/services/database.services"
import { tweetsServices } from "~/services/tweets.services"

export const createTweetController = async (req: Request<ParamsDictionary, any, TweetRequestBody>, res: Response) => {
  try {
    const { userId } = req.decoded_authorization as JwtPayload;

    const result = await tweetsServices.createTweet(userId, req.body)
    return res.json({ message: "Create tweet successfully", status: 200, result })
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Create tweet failed", status: 500, error })
  }
}