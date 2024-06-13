import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

const client = new MongoClient(process.env.MONGO_CONNECTION_STRING);

mongoose.Promise = global.Promise;

mongoose.connect(MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("Error connecting to MongoDB:", error));

export default mongoose.connection;