import { z } from "zod";

export const userFullNameSchema = z
  .string()
  .min(1, "Full Name must be 1 character or more")
  .max(50, "Full Name must be 50 characters or less")
  .trim()
  .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces");

export const userSignupSchema = z
  .object({
    fullName: userFullNameSchema,
    email: z.string().email("Invalid email address").toLowerCase(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
