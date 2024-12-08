import { z } from "zod";

export const shortcutSchema = z.object({
  shortDescription: z
    .string()
    .max(40, "shortDescription is longer than 40 characters"),
  description: z.string(),
  keys: z.array(z.string()).nonempty("At least one key is required"),
  type: z.string(),
});
