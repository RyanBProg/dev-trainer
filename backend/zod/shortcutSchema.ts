import { z } from "zod";

export const shortcutSchema = z.object({
  shortDescription: z
    .string()
    .max(40, "shortDescription is longer than 40 characters"),
  description: z.string(),
  keys: z
    .array(z.string().min(1, "String must not be empty"))
    .nonempty("At least one key is required"),
  type: z.string(),
});

export const shortcutIdSchema = z.string().min(1, "Id must not be empty");

export const shortcutIdsSchema = z.object({
  shortcutIds: z.array(shortcutIdSchema).min(1, "At least one id is required"),
});

export const queryParamSchema = z
  .string()
  .min(1, "Query param must not be empty")
  .trim()
  .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces");
