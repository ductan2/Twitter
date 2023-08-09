import express from "express"
import { loginController, registerController } from "~/controllers/users.controller";
import { AccountValidator } from "~/middlewares/users.middlewares";

const router = express.Router();


router.get("/", (req, res, next) => {
  res.send("Hello user");
})
router.post("/login", AccountValidator, loginController)
router.post('/register', AccountValidator, registerController)
export default router;