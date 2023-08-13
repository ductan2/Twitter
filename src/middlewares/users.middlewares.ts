import { Request, Response, NextFunction } from "express"
import { body, checkSchema } from "express-validator"
import { httpStatus } from "~/constants/enums";
import databaseServices from "~/services/database.services";
import UserServices from "~/services/users.services";
import { verifyToken } from "~/utils/jwt";

export const LoginValidator = checkSchema({
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
        if (!result) {
          throw new Error("Email does not exits!")
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
}, ["body"])


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
          throw new Error("Email is invalid!")
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
}, ["body"])
export const AccessTokenValidator = checkSchema({
  authorization: {
    notEmpty: {
      errorMessage: "Access token is required!"
    },
    custom: {// check access token 
      options: async (value: string, { req }) => {
        const access_token = value.split(' ')[1];
        if (!access_token || access_token === undefined) throw new Error("Access token is required")
        const decoded_authorization = await verifyToken({ token: access_token });
        req.decoded_authorization = decoded_authorization

        return true
      }
    }
  }
}, ["headers"])

export const RefreshTokenValidator = checkSchema({
  refresh_token: {
    notEmpty: {
      errorMessage: "Freshtoken is required!"
    },
    custom: {
      options: async (value: string, { req }) => {
        const [decoded_refresh_token, isCheckRefreshToken] = await Promise.all([
          verifyToken({ token: value }),
          databaseServices.refreshToken.findOne({ token: value })
        ])
        if (isCheckRefreshToken === null) {
          throw new Error("RefreshToken user does not exits!")
        }

        req.decoded_refresh_token = decoded_refresh_token
        return true;
      }
    }
  }
})
