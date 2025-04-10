import Redis from "ioredis";
import { RedisStore } from "connect-redis";
import { env } from "../zod/envSchema";

export function connectToRedis() {
  try {
    const redisClient = new Redis(env.REDIS_URL);

    redisClient.on("connect", () => {
      console.log("[server] Connected to Redis");
    });

    redisClient.on("error", (err) => {
      console.log("[server] Redis Client Error: ", err);
    });

    const redisStore = new RedisStore({
      client: redisClient,
      prefix: "devtrainer:",
    });

    return { redisClient, redisStore };
  } catch (error) {
    if (error instanceof Error) {
      console.log(`[server] Error connecting to Redis: ${error.message}`);
    } else {
      console.log(`[server] Error connecting to Redis`);
    }
    throw error;
  }
}
