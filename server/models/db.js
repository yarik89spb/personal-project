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

// mongoose.Promise = global.Promise;
// console.log( process.env.MONGO_DATABASE_NAME)

// mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
//   dbName: process.env.MONGO_DATABASE_NAME
// })
// .then(() => {
//   console.log("Connected to MongoDB");
//   // Your application logic here, e.g., starting the server
// })
// .catch((error) => {
//   console.error("Error connecting to MongoDB:", error);
//   process.exit(1); 
// });

// const db = mongoose.connection;

// db.on('error', (error) => {
//   console.error("MongoDB connection error:", error);
// });

// db.once('open', () => {
//   console.log("MongoDB connection opened.");
// });

// // db.once('open', async () => {
// //   try {
// //     // List all available databases
// //     const adminDb = db.db.admin();
// //     const databases = await adminDb.listDatabases();
// //     console.log('Available databases:');
// //     databases.databases.forEach(db => {
// //       console.log(`- ${db.name}`);
// //     });

// //     // List collections in the current database
// //     const collections = await db.db.listCollections().toArray();
// //     console.log('\nCollections in the current database:');
// //     collections.forEach(col => {
// //       console.log(`- ${col.name}`);
// //     });

// //     // Close the connection
// //     mongoose.connection.close();
// //   } catch (error) {
// //     console.error('Error listing databases and collections:', error);
// //   }
// // });

// export default db;
