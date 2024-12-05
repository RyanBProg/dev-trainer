import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4040;

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome");
});

app.listen(PORT, () => {
  console.log(`[server]: Server running on http://localhost:${PORT}`);
});
