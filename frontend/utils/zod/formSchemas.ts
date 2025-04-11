import { z } from "zod";

export const fullNameSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full Name must be 3 characters or more")
    .max(30, "Full Name must be 30 characters or less"),
});

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be 8 characters or more")
    .max(100, "Password must be less than 100 characters"),
});

const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(100, "Password must be less than 100 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]/,
    "Password must contain at least one uppercase letter, one lowercase letter and one number"
  );

export const userSignupSchema = z
  .object({
    fullName: fullNameSchema.shape.fullName,
    email: userLoginSchema.shape.email,
    password: strongPasswordSchema,
    confirmPassword: userLoginSchema.shape.password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const shortcutSchema = z.object({
  shortDescription: z
    .string()
    .min(3, "Shortcut name must be 3 characters or more")
    .max(30, "Shortcut name must be no longer than 30 characters"),
  description: z
    .string()
    .min(3, "Description must be 3 characters or more")
    .max(50, "Description must be no longer than 50 characters"),
  keys: z
    .array(z.string().min(1, "String must not be empty"))
    .nonempty("At least one key is required"),
  type: z.string().min(1, "Type can't be empty"),
});
