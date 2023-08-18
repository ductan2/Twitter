import express from "express"
import usersRouter from "./users.routes"
import mediaRouter from "./media.routes"
const router = express.Router();

router.use("/users", usersRouter);
router.use("/medias", mediaRouter);
export default router;