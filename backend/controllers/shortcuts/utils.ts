import { FilterQuery } from "mongoose";
import { z } from "zod";
import { Response } from "express";
import ShortcutsModel from "../../db/models/ShortcutsModel";
import { TCreateShortcutRequestBody } from "../../types/shortcutsControllersTypes";

export const normaliseRequestBody = (body: TCreateShortcutRequestBody) => {
  return {
    shortDescription: body.shortDescription.toLowerCase(),
    description: body.description.toLowerCase(),
    keys: body.keys.map((key: string) => key.toLowerCase()),
    type: body.type.toLowerCase(),
  };
};

export const handleControllerError = (
  error: unknown,
  res: Response,
  functionName: string
) => {
  if (error instanceof z.ZodError) {
    console.log(
      `[server] Error in zod schema validation (${functionName}): ${JSON.stringify(
        error.errors
      )}`
    );
    res.status(400).json({ error: error.errors });
    return;
  }

  console.error(`[server] Error in ${functionName}:`, error);
  res.status(500).json({ error: "Internal Server Error" });
};

export const checkKeysConflict = async (keys: string[], excludeId?: string) => {
  const query: FilterQuery<typeof ShortcutsModel> = {
    $expr: {
      $and: [
        { $eq: [{ $size: "$keys" }, keys.length] }, // check array length
        { $setEquals: ["$keys", keys] }, // check array content (order-insensitive)
      ],
    },
  };

  if (excludeId) {
    query._id = { $ne: excludeId }; // exclude current shortcut by id
  }

  return await ShortcutsModel.findOne(query);
};
