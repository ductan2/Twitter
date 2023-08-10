import { Request, Response, NextFunction } from "express"
import { checkSchema } from "express-validator"
import UserServices from "~/services/users.services";

export const AccountValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {

    return res.status(400).json({
      error: "Missing email or password!"
    });
  }
  next();
}


export const RegisterValidator = checkSchema({
  name: {
    notEmpty: true,
    isLength: {
      options: {
        min: 5,
        max: 70,
      }
    },
    trim: true
  },
  email: {
    notEmpty: true,
    isEmail: {
      errorMessage: "Email is invalid",
    },
    trim: true,
    custom: {
      options: (async (value) => {
        const userServices = new UserServices();
        const result = await userServices.checkEmailExits(value);
        if (result) {
          throw new Error("Email is alredy exits!")
        }
      })
    }
  },
  password: {
    notEmpty: true,
    isLength: {
      options: {
        min: 6,
        max: 25,
      }
    },
    isStrongPassword: {
      options: {
        minLength: 6,
        minLowercase: 1,
        minNumbers: 1,
        minUppercase: 1,
        minSymbols: 0
      },
      errorMessage: "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one digit."
    }
  },
  confirmPassword: {
    notEmpty: true,
    isLength: {
      options: {
        min: 6,
        max: 25,
      }
    },
    isStrongPassword: {
      options: {
        minLength: 6,
        minLowercase: 1,
        minNumbers: 1,
        minUppercase: 1,
        minSymbols: 0
      },
      errorMessage: "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one digit."
    },
    custom: {
      options: ((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Confirm password does not match password!")
        }
        return true;
      })
    }
  },
  date_of_birth: {
    isISO8601: {
      options: {
        strict: true,
        strictSeparator: true,
      }
    },

  }
})
