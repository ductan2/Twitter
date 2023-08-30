import { Request, Response } from "express"
import {ParamsDictionary} from "express-serve-static-core"
import { TweetRequestBody } from "~/constants/commonType"

export const createTweetController = async (req: Request<ParamsDictionary,any,TweetRequestBody>, res: Response) => {
  try {
    return res.json({ message: "Create tweet successfully", status: 200 })
  } catch (error : any) {
    return res.status(500).json({ message: error.message || "Create tweet failed", status: 500 })
  }
}