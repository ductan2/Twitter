import { Collection, Db, MongoClient } from "mongodb";
import dotenv from "dotenv"
import Follower from "~/models/schemas/follower.schema";
import User from "~/models/schemas/users.schemas";
import RefreshToken from "~/models/schemas/token.schemas";
dotenv.config()

const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.hdfborf.mongodb.net/`;


// Database Name
const dbName = process.env.DB_NAME;

class DatabaseServices {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(url)
    this.db = this.client.db(dbName);
  }
  async connect() {
    try {
      await this.client.connect();
      console.log('Connected successfully to mongoDB');
    } catch (err) {
      console.log("Connect failed")
    }
  }
  get users() {
    return this.db.collection("users")
  }
  get refreshToken() {
    return this.db.collection('refresh_token')
  }

  get followers() {
    return this.db.collection("followers")
  }

  // get followers():Collection<Follower> {
  //   return this.db.collection("followers")
  // } ==> nên sử dụng 
}

const databaseServices = new DatabaseServices();
export default databaseServices