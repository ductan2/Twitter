import { Collection, Db, MongoClient } from "mongodb";
import dotenv from "dotenv"
import { VideoStatusType } from "~/constants/commonType";
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
  async indexUsers() {
    const exits = await this.users.indexExists(["email_1_password_1", "email_1", "username_1"])
    if (!exits) {
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ email: 1 }, { unique: true })
      this.users.createIndex({ username: 1 }, { unique: true })
    }
  }
  async indexRefreshToken() {
    const exits = await this.refreshToken.indexExists(["token_1", "exp_1"])
    if(!exits){

      this.refreshToken.createIndex({ token: 1 })
      this.refreshToken.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
    }
    
    
    
  }
  async indexFollower() {
    const exits = await this.refreshToken.indexExists(["user_id_1_followed_user_id_1"])
    if (!exits){
      this.followers.createIndex({ user_id: 1, followed_user_id: 1 })
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
  get videoStatus(): Collection<VideoStatusType> {
    return this.db.collection('video_status')
  }
  // get followers():Collection<Follower> {
  //   return this.db.collection("followers")
  // } ==> nên sử dụng 
}

const databaseServices = new DatabaseServices();
export default databaseServices