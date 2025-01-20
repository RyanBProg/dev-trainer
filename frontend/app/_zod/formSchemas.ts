import { z } from "zod";

export const fullNameSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full Name must be 3 characters or more")
    .max(30, "Full Name must be 30 characters or less"),
});

export const userSigninSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be 8 characters or more"),
});

export const userSignupSchema = z
  .object({
    fullName: fullNameSchema.shape.fullName,
    email: userSigninSchema.shape.email,
    password: userSigninSchema.shape.password,
    confirmPassword: userSigninSchema.shape.password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const shortcutSchema = z.object({
  shortDescription: z
    .string()
    .min(1, "Short description can't be empty")
    .max(30, "Short description is longer than 30 characters"),
  description: z
    .string()
    .min(1, "Description can't be empty")
    .max(50, "Description is longer than 50 characters"),
  keys: z
    .array(z.string().min(1, "String must not be empty"))
    .nonempty("At least one key is required"),
  type: z.string(),
});
