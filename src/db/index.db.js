import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n Mongo DB connected !! DB HOST ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Mongo DB connection error", error);
  }
};

export default connectDB;