import bcrypt from "bcrypt";
const saltRounds = 10;
export const hassPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}
export const checkPassword = (plaintext: string, hash: string) => {
  return bcrypt.compareSync(plaintext, hash);
}

