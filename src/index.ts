import express, { NextFunction, Request, Response } from "express"
import routerTwitter from "./routers/index.routes"
import databaseServices from "./services/database.services"


const app = express()

const PORT = process.env.PORT
databaseServices.connect();
app.use(express.json());



app.listen(PORT, () => {
  console.log(`This is http://localhost:${PORT}`)
})

app.use("/", routerTwitter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status).json({ error: err.message, status: err.status })

})

