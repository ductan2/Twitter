import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

export const signToken = ({ payload, privatekey = process.env.JWT_SECRET as string, options }: {
  payload: string | object | Buffer,
  privatekey?: string,
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    if (!options) {
      options = {};
    }
    if (options && options.expiresIn) {
      // Tính toán thời gian hết hạn từ thời gian hiện tại
      const now = Math.floor(Date.now() / 1000);
    
      const expiresIn = now + Number(options.expiresIn);

      // Thêm thuộc tính 'exp' vào payload
      payload = { ...payload as object, exp: expiresIn };
    }
    jwt.sign(payload, privatekey, (err: any, token: any) => {
      if (err) throw reject(err);
      resolve(token)
    });
  })
}



export const verifyToken = ({ token, secretOrPublickey = process.env.JWT_SECRET as string }: {
  token: string,
  secretOrPublickey?: string
}) => {
  return new Promise<JwtPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublickey, (error, decoded) => {

      if (error) {
        throw reject(error)
      }
      resolve(decoded as JwtPayload)
    })
  })
}
