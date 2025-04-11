import { z } from "zod";

export const adminPasswordSchema = z.object({
  adminPassword: z
    .string()
    .min(1, "Admin password is required")
    .max(100, "Admin password is too long")
    .trim(),
});

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

export const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

export const userFullNameSchema = z
  .string()
  .min(1, "Full Name must be 1 character or more")
  .max(50, "Full Name must be 50 characters or less")
  .trim()
  .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces");

export const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(100, "Password must be less than 100 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]/,
    "Password must contain at least one uppercase letter, one lowercase letter and one number"
  );

export const userSignupSchema = z
  .object({
    fullName: userFullNameSchema,
    email: z.string().email("Invalid email address").toLowerCase(),
    password: strongPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
