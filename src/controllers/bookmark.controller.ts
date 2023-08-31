import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { bookMarkServices } from "~/services/bookmark.services";

export const createBookMarkController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.decoded_authorization as JwtPayload
    const { value } = await bookMarkServices.bookMarkTweet(req.body.tweetId, userId)
    return res.json({ message: "Create bookmark successfully", status: 200, result: value })
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Create bookmark failed", status: 500, error })
  }
}