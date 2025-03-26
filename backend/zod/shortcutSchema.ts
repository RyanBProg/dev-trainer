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
