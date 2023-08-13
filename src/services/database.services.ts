import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv"
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
}

const databaseServices = new DatabaseServices();
export default databaseServices