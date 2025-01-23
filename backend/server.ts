import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectToDB from "./db/connectToDB";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import shortcutRoutes from "./routes/shortcutsRoutes";
import cors from "cors";

const app: Express = express();
const PORT = process.env.PORT || 4040;
dotenv.config();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/shortcuts", shortcutRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome");
});

app.listen(PORT, () => {
  connectToDB();
  console.log(`[server] Server running on http://localhost:${PORT}`);
});
