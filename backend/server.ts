import express, { Express, Response } from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import shortcutRoutes from "./routes/shortcutsRoutes";
import cors from "cors";
import helmet from "helmet";
import connectToDB from "./db/connectToDB";
import { appRequestLimiter } from "./utils/rateLimits";
import { env } from "./zod/envSchema";
import session from "express-session";
import { connectToRedis } from "./db/connectToRedis";

const app: Express = express();

// Only trust one proxy (Vercel)
app.set("trust proxy", 1);

// Helmet headers setup
app.use(
  helmet({
    noSniff: true,
    hidePoweredBy: true,
    xssFilter: true,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", env.FRONTEND_URL],
      },
    },
  })
);

// CORS setup
const corsOptions = {
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// Parsing
app.use(express.json());
app.use(cookieParser());

// Mongoose DB connection
connectToDB();

// Connect to Redis
const { redisStore } = connectToRedis();

// sessions setup
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: redisStore,
    name: "session-id",
    rolling: true, // Resets expiry on each request
    cookie: {
      secure: env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      domain: ".devtrainer.net",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Rate limiting for all routes
app.use(appRequestLimiter);

// Route handlers
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/shortcuts", shortcutRoutes);

// Welcome route
app.get("/", (_, res: Response) => {
  res.status(200).send("Welcome to the Dev Trainer API");
});

app.listen(env.PORT, () => {
  console.log(`[server] Server running on http://localhost:${env.PORT}`);
});

// export for vercel
export default app;
