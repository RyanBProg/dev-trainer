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

const app: Express = express();
const PORT = env.PORT;

app.use(
  helmet({
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
  origin: env.NODE_ENV === "production" ? env.BACKEND_URL : env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

app.use(appRequestLimiter);
app.use(express.json());
app.use(cookieParser());

connectToDB();

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/shortcuts", shortcutRoutes);

app.get("/", (_, res: Response) => {
  res.status(200).send("Welcome to the Dev Trainer API");
});

app.listen(PORT, () => {
  console.log(`[server] Server running on http://localhost:${PORT}`);
});

// export for vercel
export default app;
