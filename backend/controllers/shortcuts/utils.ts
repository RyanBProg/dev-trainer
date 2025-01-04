import { FilterQuery } from "mongoose";
import ShortcutModel from "../../db/models/ShortcutModel";
import { TCreateShortcutRequestBody } from "../../types/requestBodyControllersTypes";

export const normaliseRequestBody = (body: TCreateShortcutRequestBody) => {
  return {
    shortDescription: body.shortDescription.toLowerCase(),
    description: body.description.toLowerCase(),
    keys: body.keys.map((key: string) => key.toLowerCase()),
    type: body.type.toLowerCase(),
  };
};

export const checkKeysConflict = async (keys: string[], excludeId?: string) => {
  const query: FilterQuery<typeof ShortcutModel> = {
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

  return await ShortcutModel.findOne(query);
};
