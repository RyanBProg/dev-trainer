import { Request, RequestHandler, Response } from "express";
import ShortcutModel from "../../db/models/ShortcutModel";
import { shortcutSchema } from "../../zod/shortcutSchema";
import { TCreateShortcutRequestBody } from "../../types/requestBodyControllersTypes";
import { checkKeysConflict, normaliseRequestBody } from "./utils";
import { handleControllerError } from "../../utils/handleControllerError";

export const getShortcuts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    if (pageNumber < 1 || limitNumber < 1) {
      res
        .status(400)
        .json({ error: "Page and limit must be positive integers" });
      return;
    }

    const shortcuts = await ShortcutModel.find()
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ createdAt: -1 })
      .lean();

    const totalItems = await ShortcutModel.countDocuments();
    const totalPages = Math.ceil(totalItems / limitNumber);

    res.status(200).json({
      shortcuts,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalItems,
        limit: limitNumber,
      },
    });
  } catch (error) {
    handleControllerError(error, res, "getShortcuts");
  }
};

export const getShortcutTypes = async (_: Request, res: Response) => {
  try {
    const types = await ShortcutModel.distinct("type").lean();

    if (!types || types.length === 0) {
      res.status(404).json({ error: "No types found" });
      return;
    }

    res.status(200).json(types);
  } catch (error) {
    handleControllerError(error, res, "getShortcutTypes");
  }
};

export const getShortcutsOfType = async (req: Request, res: Response) => {
  try {
    const type = decodeURIComponent(req.params.type);
    if (!type) {
      res.status(400).json({ error: "Type parameter is required" });
      return;
    }

    const shortcuts = await ShortcutModel.find({ type }).lean();
    if (!shortcuts || shortcuts.length === 0) {
      res
        .status(404)
        .json({ error: "No shortcuts found for the specified type" });
      return;
    }

    res.status(200).json(shortcuts);
  } catch (error) {
    handleControllerError(error, res, "getShortcutsTypeOfType");
  }
};

export const getShortcut = async (req: Request, res: Response) => {
  try {
    const shortcutId = req.params.id;
    const shortcutData = await ShortcutModel.findOne({
      _id: shortcutId,
    }).lean();
    if (!shortcutData) {
      res.status(400).json({ error: "Shortcut not found" });
      return;
    }

    res.status(200).json(shortcutData);
  } catch (error) {
    handleControllerError(error, res, "getShortcut");
  }
};

export const createNewShortcut: RequestHandler<
  {},
  {},
  TCreateShortcutRequestBody,
  {}
> = async (req, res) => {
  try {
    const parsedData = shortcutSchema.parse(req.body);
    const normalisedData = normaliseRequestBody(parsedData);
    const { shortDescription, description, keys, type } = normalisedData;

    // Check for conflicting keys
    const conflict = await checkKeysConflict(keys);
    if (conflict) {
      res.status(400).json({ error: "Keys matches an existing shortcut" });
      return;
    }

    const newShortcut = new ShortcutModel({
      shortDescription,
      description,
      keys,
      type,
    });

    const savedShortcut = await newShortcut.save();

    res.status(201).json(savedShortcut);
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
    const shortcutData = await ShortcutModel.findOne({
      _id: shortcutId,
    }).lean();
    if (!shortcutData) {
      res.status(400).json({ error: "Shortcut not found" });
      return;
    }

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
    ).lean();
    if (!updatedShortcut) {
      res.status(400).json({ error: "Failed to update the shortcut" });
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
    if (!result.deletedCount) {
      res
        .status(400)
        .json({ error: "Shortcut ID couldn't be found or deleted" });
      return;
    }

    res.status(200).json({ message: "Successfully deleted shortcut" });
  } catch (error) {
    handleControllerError(error, res, "deleteShortcut");
  }
};
