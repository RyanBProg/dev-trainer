import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});
