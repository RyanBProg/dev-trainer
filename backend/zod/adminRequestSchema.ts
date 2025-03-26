import { z } from "zod";

export const adminPasswordSchema = z.object({
  adminPassword: z
    .string()
    .min(1, "Admin password is required")
    .max(100, "Admin password is too long")
    .trim(),
});
