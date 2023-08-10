import { Request, Response, NextFunction } from "express"
import User from "~/models/schemas/users.schemas"
import databaseServices from "~/services/database.services"
import UserServices from "~/services/users.services"

const userServices = new UserServices();


export const loginController = (req: Request, res: Response) => {
  res.json({
    message: "Login success!"
  })
  // check case pass and email matches
}

export const registerController = async (req: Request, res: Response) => {
  const { name, email, password, date_of_birth } = req.body;
  try {
    const result = userServices.register({ name, email, password, date_of_birth });
    return res.status(200).json({
      message: "Register successfully!",
      result
    })
  }
  catch (error) {
    return res.status(200).json({
      message: "Register failed!",
      error
    })
  }
}