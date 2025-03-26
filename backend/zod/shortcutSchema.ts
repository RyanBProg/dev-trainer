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

export const shortcutIdSchema = z.object({
  shortcutIds: z.array(z.string()).min(1, "At least one id is required"),
});
