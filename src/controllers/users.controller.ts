import { Request, Response, NextFunction, RequestHandler } from "express"
import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { UserVerifyStatus } from "~/models/schemas/users.schemas";
import databaseServices from "~/services/database.services";
import UserServices from "~/services/users.services"

const userServices = new UserServices();

export const registerController: RequestHandler = async (req, res) => {
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
export const loginController: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await databaseServices.users.findOne({ email });
    const verify = user?.verify
    console.log("🚀 ~ file: users.controller.ts:34 ~ constloginController:RequestHandler= ~ verify:", verify)
    const result = await userServices.login(({ email, password, verify }))
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

export const logoutController: RequestHandler = async (req, res) => {
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
      status: 400,
      error
    })
  }


}

export const emailVerifyValidator: RequestHandler = async (req, res) => {

  try {
    const { email_verify_token } = req.body;
    const token = await databaseServices.users.findOne({ email_verify_token })

    const user = await databaseServices.users.findOne({ _id: new ObjectId(token?._id) });
    if (!user) {
      return res.status(404).json({
        message: "User does not exits!",
        status: 404,
      })
    }
    userServices.verifyEmail(user._id.toString())
    return res.json({
      message: "Email verify successfully",
      status: 200
    })

  } catch (error) {
    return res.status(500).json({
      message: "Error verifying Email",
      status: 500,
      error
    })
  }
}

export const resendVerifyEmailController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.decoded_authorization as JwtPayload;
    const user = await databaseServices.users.findOne({ _id: new ObjectId(userId) })
    if (!user) {
      return res.status(404).json({
        message: "User does not exits!",
        status: 404,
      })
    }
    if (user.verify === 1) {
      return res.json({
        message: "User already verified!",
        status: 200,
      })
    }
    await userServices.resendVerifyEmail(user._id.toString());
    return res.status(200).json({
      message: "Resend successfully!",
      status: 200
    })
  } catch (error) {
    return res.status(500).json({
      message: "Error verifying Email",
      status: 500,
      error
    })
  }
}
export const forgotPasswordController: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await databaseServices.users.findOne({ email })

    const result = await userServices.forgotPassword(email?.toString(), user?.verify)
    return res.json(result)
  } catch (error) {
    return res.json(error)
  }
}

export const verifyForgotPasswordController: RequestHandler = async (req, res) => {
  return res.json({
    message: "Password verify successfully!",
    status: 200
  })
}
export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.decoded_forgot_passowd_token as JwtPayload;
    const { password } = req.body;
    await userServices.resetPassword(userId, password)
    return res.status(200).json({
      message: "Reset password successfully!",
      status: 200,
    })
  } catch (error) {
    return res.status(404).json({
      message: "Reset password failed!",
      status: 404,
    })
  }
}
export const changePasswordController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.decoded_authorization as JwtPayload
    const { oldPassword, newPassword } = req.body;
    const result = await userServices.changePassword(userId, oldPassword, newPassword);
    return res.status(result.status).json(result)
  } catch (error) {
    return res.status(400).json({
      message: "Change password failed",
      status: 400,
    })
  }
}
export const getInfoController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.decoded_authorization as JwtPayload;
    console.log("🚀 ~ file: users.controller.ts:162 ~ getInfoController ~ userId:", userId)
    const data = await userServices.getInfo(userId);
    return res.json({
      message: "Get infomation user success",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Get infomation user failed!",
      status: 400,
    })
  }
}
export const updateInfoController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.decoded_authorization as JwtPayload;
    console.log("🚀 ~ file: users.controller.ts:183 ~ updateInfoController ~ user_id:", userId)
    const body = req.body;
    const result = await userServices.updateInfo(userId, body);
    return res.json({
      message: "Update successfully!",
      status: 200,
      result
    });
  } catch (error) {
    return res.status(400).json({
      message: "Update user failed!",
      status: 400,
    })
  }

}


export const followController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.decoded_authorization as JwtPayload;
    const { followed_user_id } = req.body;
    const result = await userServices.follow(userId, followed_user_id);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      message: "Follow failed!",
      status: 400,
    })
  }
}
export const unFollowController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.decoded_authorization as JwtPayload;
    const { user_id: unFollow_user_id } = req.params;

    const result = await userServices.unFollow(userId, unFollow_user_id)
    return res.status(result.status).json(result)
  } catch (error) {
    return res.status(404).json({
      message: "User id not found!",
      status: 404,
    })
  }

}