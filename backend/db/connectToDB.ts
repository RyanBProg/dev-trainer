import mongoose from "mongoose";
import catchErrorMessage from "../utils/catchErrorMessage";

const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) throw new Error();

async function connectToDB() {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) throw new Error("No mongodb url found in .env");

    await mongoose.connect(mongoUrl);
    console.log("[server]: Connected to MongoDB");
  } catch (error) {
    catchErrorMessage("Error connecting to MongoDB", error);
  }
}
export default connectToDB;
