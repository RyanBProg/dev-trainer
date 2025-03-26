import { z } from "zod";
import { Response } from "express";

export const handleControllerError = (
  error: unknown,
  res: Response,
  functionName: string
) => {
  if (error instanceof z.ZodError) {
    console.log(
      `[server] Error in ${functionName}: ${JSON.stringify(error.errors)}`
    );
    res
      .status(400)
      .json({ message: "User input format error", code: "INPUT_FORMAT_ERROR" });
  } else if (error instanceof Error) {
    console.log(`[server] Error in ${functionName}: ${error.message}`);
  } else {
    console.error(`[server] Error in ${functionName}`);
  }

  res
    .status(500)
    .json({ message: "Internal server error", code: "INTERNAL_SERVER_ERROR" });
};
