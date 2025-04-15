import rateLimit from "express-rate-limit";

export const appRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  handler: (_, res) => {
    res.status(429).json({
      message: "Too many requests, please try again later.",
      code: "RATE_LIMIT_EXCEEDED",
      status: 429,
    });
  },
  headers: true,
});

export const loginAttemptLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  handler: (_, res) => {
    res.status(429).json({
      message: "Too many login attempts. Please try again in 15 minutes.",
      code: "RATE_LIMIT_EXCEEDED",
      status: 429,
    });
  },
  headers: true,
});

export const snippetRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  handler: (_, res) => {
    res.status(429).json({
      message: "Too many requests, please try again later.",
      code: "RATE_LIMIT_EXCEEDED",
      status: 429,
    });
  },
  headers: true,
});
