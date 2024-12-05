import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) throw new Error();

async function connectToDB() {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) throw new Error();

    await mongoose.connect(mongoUrl);
    console.log("[server]: Connected to MongoDB");
  } catch (error) {
    if (error instanceof Error) {
      console.log("[server]: Error connecting to MongoDB: ", error.message);
    } else {
      console.log("[server]: Error connecting to MongoDB - connectToDB()");
    }
  }
}
export default connectToDB;
