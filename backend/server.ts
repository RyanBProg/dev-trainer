import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import shortcutRoutes from "./routes/shortcutsRoutes";
import cors from "cors";
import connectToDB from "./db/connectToDB";

const app: Express = express();
dotenv.config();
const PORT = process.env.PORT || 4040;

// CORS setup
const corsOptions = {
  origin: "https://dev-trainer-frontend-ryans-projects-197c1757.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

app.use(express.json());
app.use(cookieParser());

connectToDB();

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/shortcuts", shortcutRoutes);

app.get("/", (req: Request, res: Response) => {
  console.log("1");
  res.status(200).send("Welcome");
});

app.listen(PORT, () => {
  console.log(`[server] Server running on http://localhost:${PORT}`);
});

// export for vercel
export default app;
