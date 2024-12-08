import { Request, RequestHandler, Response } from "express";
import ShortcutsModel from "../db/models/ShortcutsModel";
import { shortcutSchema } from "../zod/shortcutSchema";
import catchErrorMessage from "../utils/catchErrorMessage";
import { z } from "zod";

export const getShortcuts = async (req: Request, res: Response) => {
  res.status(200).json({ message: "shortcuts" });
  // finish me!!!
};

// define the structure of the request body
type TCreateNewShortcutRequestBody = {
  shortDescription: string;
  description: string;
  keys: string[];
  type: string;
};

export const createNewShortcut: RequestHandler<
  {},
  {},
  TCreateNewShortcutRequestBody,
  {}
> = async (req, res) => {
  try {
    // validate the request body using Zod
    const parsedData = shortcutSchema.parse(req.body);
    const { shortDescription, description, keys, type } = parsedData;

    // Check if keys match any existing keys in the database
    const matchingKeysShortcut = await ShortcutsModel.findOne({
      $expr: {
        $and: [
          { $eq: [{ $size: "$keys" }, keys.length] }, // quick size check
          { $setEquals: ["$keys", keys] }, // deep equality check
        ],
      },
    });

    if (matchingKeysShortcut) {
      res
        .status(400)
        .json({ error: "Keys array matches an existing shortcut" });
      return;
    }

    // create a new shortcut
    const newShortcut = new ShortcutsModel({
      shortDescription,
      description,
      keys,
      type,
    });

    // check for the new shortcut
    if (newShortcut) {
      const savedShortcut = await newShortcut.save();

      // send the created shortcut details as a response
      res.status(201).json({
        _id: savedShortcut._id,
        shortDescription: savedShortcut.shortDescription,
        description: savedShortcut.description,
        keys: savedShortcut.keys,
        type: savedShortcut.type,
      });
      return;
    } else {
      res.status(400).json({ error: "Invalid shortucut data" });
      return;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // handle validation errors from Zod
      console.log(
        `[server] Error in zod userSignupSchema: ${JSON.stringify(
          error.errors
        )}`
      );
      res.status(400).json({ error: error.errors });
      return;
    }

    // handle other errors
    catchErrorMessage("Error in signup controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
