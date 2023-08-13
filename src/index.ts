import express from "express"
import routerUser from "./routers/index.routes"
import databaseServices from "./services/database.services"
const app = express()

const PORT = process.env.PORT
databaseServices.connect();
app.use(express.json());

// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   res.status(400).json({ error: err.message })
// })
app.listen(PORT, () => {
  console.log(`This is http://localhost:${PORT}`)
})

app.use("/", routerUser)



