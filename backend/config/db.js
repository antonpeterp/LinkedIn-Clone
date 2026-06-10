import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connect(process.env.DATABASE_URI);
  } catch (error) {
    console.log("DB Connection ERROR", error);
  }
};
export default connectDB;
