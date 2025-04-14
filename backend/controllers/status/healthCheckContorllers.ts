import { RequestHandler } from "express";
import mongoose from "mongoose";
import { getRedisClient } from "../../db/connectToRedis";
import { handleControllerError } from "../../utils/handleControllerError";
import { env } from "../../zod/envSchema";

export const healthCheck: RequestHandler = async (req, res) => {
  try {
    // Check CRON_SECRET for automated health checks
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const [type, token] = authHeader.split(" ");
      if (type !== "Bearer" || token !== env.CRON_SECRET) {
        res.status(401).json({
          status: "error",
          message: "Unauthorized health check request",
        });

        return;
      }
    }

    // Check MongoDB connection
    const mongoStatus = await mongoose.connection.db?.admin().ping();

    // Check Redis connection
    const redisClient = getRedisClient();
    const redisStatus = await redisClient.ping();

    const isHealthy = mongoStatus && redisStatus === "PONG";

    if (!isHealthy) {
      throw new Error("Database connections failed health check");
    }

    res.status(200).json({
      status: "healthy",
      mongo: mongoStatus ? "connected" : "disconnected",
      redis: redisStatus === "PONG" ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Use your existing error handler
    handleControllerError(error, res, "healthCheck");
  }
};
