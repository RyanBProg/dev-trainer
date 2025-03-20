import rateLimit from "express-rate-limit";

export const attemptLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many login attempts. Try again later.",
});
