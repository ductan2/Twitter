import express, { NextFunction, Request, Response } from "express"
import routerTwitter from "./routers/index.routes"
import databaseServices from "./services/database.services"
import { UPLOAD_IMAGE_DIR } from "./constants/dir"
const app = express()




const PORT = process.env.PORT
databaseServices.connect().then(() => {
  databaseServices.indexUsers()
  databaseServices.indexRefreshToken()
  databaseServices.indexFollower()
});
app.use(express.json());
app.use("/uploads/image", express.static(UPLOAD_IMAGE_DIR));
app.use("/", routerTwitter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status).json({ error: err.message, status: err.status })
})


app.listen(PORT, () => {
  console.log(`This is http://localhost:${PORT}`)
})



