import mongoose from "mongoose";

const connectDB = (url) => {
  const connectionString = url || process.env.MONGO_URI || "mongodb://localhost:27017/eCommerce";
  console.log("Connecting to database ");
  
  return mongoose.connect(connectionString, {}).then(
    () => {
      console.log(`connected to your database successfully`);
    },
    (error) => {
      console.log(`MongoDb connection error: ${error}`);
    },
  );
};

export default connectDB;
