import crypto from "crypto";
import { env } from "../zod/envSchema";

const IV_LENGTH = 16; // For AES-256-GCM

export const encryptToken = (token: string): string => {
  // Generate a random IV for each encryption
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    env.TOKEN_ENCRYPTION_KEY,
    iv
  );

  // Get auth tag for integrity verification
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  // Combine IV, auth tag, and encrypted data with delimiters
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
};

export const decryptToken = (encryptedToken: string): string => {
  // Split the stored data back into IV, auth tag, and encrypted parts
  const [ivHex, authTagHex, encryptedText] = encryptedToken.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    env.TOKEN_ENCRYPTION_KEY,
    iv
  );
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
