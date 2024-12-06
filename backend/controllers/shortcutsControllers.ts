import { Request, Response } from "express";

async function getShortcuts(req: Request, res: Response) {
  res.status(200).json({ message: "shortcuts" });
}

export default getShortcuts;
