import mongoose from "mongoose";
import { env } from "../zod/envSchema";

async function connectToDB() {
  try {
    await mongoose.connect(env.MONGO_URL);
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
