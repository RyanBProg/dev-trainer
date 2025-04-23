import { Request, RequestHandler, Response } from "express";
import ShortcutModel from "../../db/models/ShortcutModel";
import { queryParamSchema, shortcutSchema } from "../../zod/schemas";
import { TCreateShortcutRequestBody } from "../../types/types";
import { checkKeysConflict, normaliseRequestBody } from "./utils";
import { handleControllerError } from "../../utils/handleControllerError";
import { Types } from "mongoose";

export const getShortcuts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    if (pageNumber < 1 || limitNumber < 1) {
      res.status(400).json({
        message: "Page and limit must be positive integers",
        code: "INVALID_PAGE_LIMIT",
      });
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

    if (types.length === 0) {
      res
        .status(404)
        .json({ message: "No types found", code: "NO_TYPES_FOUND" });
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
    const { page = 1, limit = 15 } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const result = queryParamSchema.safeParse(type);
    if (!result.success) {
      res.status(400).json({
        message: "Invalid type format",
        code: "INVALID_TYPE_FORMAT",
      });
      return;
    }

    if (pageNumber < 1 || limitNumber < 1) {
      res.status(400).json({
        message: "Page and limit must be positive integers",
        code: "INVALID_PAGE_LIMIT",
      });
      return;
    }

    const shortcuts = await ShortcutModel.find({ type })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ createdAt: -1 })
      .lean();

    const totalItems = await ShortcutModel.countDocuments({ type });
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
    handleControllerError(error, res, "getShortcutsTypeOfType");
  }
};

export const getShortcut = async (req: Request, res: Response) => {
  try {
    const shortcutId = req.params.id;

    if (!Types.ObjectId.isValid(shortcutId)) {
      res.status(400).json({
        message: "Invalid shortcut ID format",
        code: "INVALID_ID_FORMAT",
      });
      return;
    }
    const shortcutData = await ShortcutModel.findOne({
      _id: shortcutId,
    }).lean();
    if (!shortcutData) {
      res
        .status(404)
        .json({ message: "Shortcut not found", code: "SHORTCUT_NOT_FOUND" });
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
      res.status(400).json({
        message: "Keys matches an existing shortcut",
        code: "KEY_CONFLICT",
      });
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
      res
        .status(404)
        .json({ message: "Shortcut not found", code: "NOT_FOUND" });
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
      res.status(400).json({
        message: "Keys array matches an existing shortcut",
        code: "KEY_CONFLICT",
      });
      return;
    }

    // find existing shortcut and update
    const updatedShortcut = await ShortcutModel.findByIdAndUpdate(
      shortcutId,
      { shortDescription, description, keys, type },
      { new: true, runValidators: true }
    ).lean();
    if (!updatedShortcut) {
      res.status(400).json({
        message: "Failed to update the shortcut",
        code: "UPDATE_FAILED",
      });
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

    if (!Types.ObjectId.isValid(shortcutId)) {
      res.status(400).json({
        message: "Invalid shortcut ID format",
        code: "INVALID_ID_FORMAT",
      });
      return;
    }

    const result = await ShortcutModel.deleteOne({ _id: shortcutId });
    if (!result.deletedCount) {
      res.status(404).json({
        message: "Shortcut ID couldn't be found or deleted",
        code: "NOT_FOUND",
      });
      return;
    }

    res.status(200).json({
      message: "Successfully deleted shortcut",
      code: "SHORTCUT_DELETED",
    });
  } catch (error) {
    handleControllerError(error, res, "deleteShortcut");
  }
};
