import { Request } from 'express'; // Đảm bảo rằng bạn đã import đúng kiểu Request
import User from './models/schemas/users.schemas';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express' {
  interface Request {
    decoded_authorization?: JwtPayload; // Kiểu dữ liệu của decoded_authorization
    user?: User,
    decoded_forgot_passowd_token?:JwtPayload
  }
}