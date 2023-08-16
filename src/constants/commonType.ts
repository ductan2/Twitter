export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPassowrd,
  EmailVerifyToken,
}

export enum httpStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  UNPROCESSABLE_ENTITY = 422,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}
interface ErrorWithStatusType {
  message: string,
  status: number
}
export default class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: ErrorWithStatusType) {
    this.message = message,
      this.status = status
  }
}

export interface FollowBody {
  follow_user_id: string,
}