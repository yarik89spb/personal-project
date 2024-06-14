import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
      autoIndex: true,
      dbName: process.env.MONGO_DATABASE_NAME
    })
    console.log('Connected to Mongodb Atlas');} catch (error) {
    console.error(error);
}
}
export default connectToDB

