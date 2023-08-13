import { Request, Response, NextFunction } from "express"
import UserServices from "~/services/users.services"

const userServices = new UserServices();

export const registerController = async (req: Request, res: Response) => {
  const { name, email, password, date_of_birth } = req.body;
  try {
    const result = await userServices.register({ name, email, password, date_of_birth });

    return res.status(201).json({
      message: "Register successfully!",
      status: 201,
      result
    })
  }
  catch (error) {
    return res.status(400).json({
      message: "Register failed!",
      error
    })
  }
}
export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await userServices.login({ email, password })
    return res.status(200).json({
      message: "Login success!",
      stauts: 200,
      result
    })
  } catch (error: any) {
    let status = 401;
    if (error.status) {
      status = error.status;
    }
    return res.status(status).json({
      message: error.message,
      status: 401,
    });
  }

}

export const logoutController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body
  try {
    const result = await userServices.logout(refresh_token)
    return res.status(200).json({
      message: result.message,
      status: result.status,
    })
  } catch (error) {
    return res.status(400).json({
      message: "Logout failed!",
      status: 400
    })
  }


}
