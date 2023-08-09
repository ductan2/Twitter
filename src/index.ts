import express from "express"
import routerUser from "./routers/index.routes"
import databaseServices from "./services/database.services"
const app = express()


app.use(express.json());
const PORT=process.env.PORT
app.listen(PORT, () => {
  console.log(`This is http://localhost:${PORT}`)
})
databaseServices.connect();
  
app.use("/", routerUser)
