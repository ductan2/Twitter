import express from "express"
import usersRouter from "./users.routes"
import mediaRouter from "./media.routes"
import staticRouter from "./static.routes"
import tweetRouter from "./tweets.routes"
import bookmarkRouter from "./bookmark.routes"

const router = express.Router();

router.use("/users", usersRouter);
router.use("/medias", mediaRouter);
router.use('/static', staticRouter)
router.use('/tweets', tweetRouter)
router.use('/bookmarks', bookmarkRouter)

export default router;