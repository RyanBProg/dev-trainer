import mongoose from "mongoose";
import { env } from "../zod/envSchema";

async function connectToDB() {
  try {
    const mongoUrl = env.MONGO_URL;
    if (!mongoUrl) throw new Error("No mongodb url found in .env");

    await mongoose.connect(mongoUrl);
    console.log("[server] Connected to MongoDB");
  } catch (error) {
    if (error instanceof Error) {
      console.log(`[server] Error connecting to MongoDB: ${error.message}`);
    } else {
      console.log(`[server] Error connecting to MongoDB`);
    }
  }
}

export default connectToDB;
