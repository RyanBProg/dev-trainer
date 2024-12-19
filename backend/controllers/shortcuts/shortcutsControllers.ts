import { Request, RequestHandler, Response } from "express";
import ShortcutModel from "../../db/models/ShortcutModel";
import { shortcutSchema } from "../../zod/shortcutSchema";
import catchErrorMessage from "../../utils/catchErrorMessage";
import { TCreateShortcutRequestBody } from "../../types/requestBodyControllersTypes";
import {
  checkKeysConflict,
  handleControllerError,
  normaliseRequestBody,
} from "./utils";

export const getShortcuts = async (req: Request, res: Response) => {
  res.status(200).json({ message: "shortcuts" });
  // finish me!!!
};

export const getShortcutTypes = async (req: Request, res: Response) => {
  try {
    const types = await ShortcutModel.distinct("type");

    if (!types || types.length === 0) {
      res.status(404).json({ error: "No types found" });
      return;
    }

    res.status(200).json(types);
  } catch (error) {
    catchErrorMessage("Error in getShortcutTypes", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getShortcutsOfType = async (req: Request, res: Response) => {
  try {
    const type = decodeURIComponent(req.params.type);
    if (!type) {
      res.status(400).json({ error: "Type parameter is required" });
      return;
    }

    const shortcuts = await ShortcutModel.find({ type });
    if (!shortcuts || shortcuts.length === 0) {
      res
        .status(404)
        .json({ error: "No shortcuts found for the specified type" });
      return;
    }

    res.status(200).json(shortcuts);
  } catch (error) {
    catchErrorMessage("Error in getShortcutsOfType", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getShortcut = async (req: Request, res: Response) => {
  try {
    const shortcutId = req.params.id;
    const shortcutData = await ShortcutModel.findOne({ _id: shortcutId });
    if (!shortcutData) throw new Error("Shortcut not found");

    res.status(200).json(shortcutData);
  } catch (error) {
    catchErrorMessage("Error in getShortcut", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createNewShortcut: RequestHandler<
  {},
  {},
  TCreateShortcutRequestBody,
  {}
> = async (req, res) => {
  try {
    // validate the request body using Zod
    const parsedData = shortcutSchema.parse(req.body);

    // normalise request body to lowercase
    const normalisedData = normaliseRequestBody(parsedData);
    const { shortDescription, description, keys, type } = normalisedData;

    // Check for conflicting keys
    const conflict = await checkKeysConflict(keys);
    if (conflict) {
      res
        .status(400)
        .json({ error: "Keys array matches an existing shortcut" });
      return;
    }

    // create a new shortcut
    const newShortcut = new ShortcutModel({
      shortDescription,
      description,
      keys,
      type,
    });
    if (!newShortcut) {
      res.status(500).json({ error: "Failed to create the shortcut" });
      return;
    }

    // save shortcut and send as a response
    const savedShortcut = await newShortcut.save();
    res.status(201).json(savedShortcut);
    return;
  } catch (error) {
    handleControllerError(error, res, "createNewShortcut");
  }
};

export const updateShortcut: RequestHandler<
  { id: string },
  {},
  TCreateShortcutRequestBody,
  {}
> = async (req, res) => {
  try {
    // check shortcut exists
    const shortcutId = req.params.id;
    const shortcutData = await ShortcutModel.findOne({ _id: shortcutId });
    if (!shortcutData) throw new Error("Shortcut not found");

    // validate the request body using Zod
    const parsedData = shortcutSchema.parse(req.body);

    // normalise request body to lowercase
    const normalisedData = normaliseRequestBody(parsedData);
    const { shortDescription, description, keys, type } = normalisedData;

    // Check for conflicting keys, excluding the current shortcut
    const conflict = await checkKeysConflict(keys, shortcutId);
    if (conflict) {
      res
        .status(400)
        .json({ error: "Keys array matches an existing shortcut" });
      return;
    }

    // find existing shortcut and update
    const updatedShortcut = await ShortcutModel.findByIdAndUpdate(
      shortcutId,
      { shortDescription, description, keys, type },
      { new: true, runValidators: true }
    );

    if (!updatedShortcut) {
      res.status(500).json({ error: "Failed to update the shortcut" });
      return;
    }

    // send the updated shortcut as the response
    res.status(200).json(updatedShortcut);
  } catch (error) {
    handleControllerError(error, res, "updateShortcut");
  }
};

export const deleteShortcut = async (req: Request, res: Response) => {
  try {
    const shortcutId = req.params.id;
    const result = await ShortcutModel.deleteOne({ _id: shortcutId });
    if (!result.deletedCount)
      throw new Error("Shortcut ID couldn't be found or deleted");

    res.status(200).json({ message: "Successfully deleted shortcut" });
  } catch (error) {
    catchErrorMessage("Error in deleteShortcut", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
