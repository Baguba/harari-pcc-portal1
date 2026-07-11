/**
 * Password hashing utilities using Node.js built-in crypto module.
 * Uses PBKDF2 with a random salt for secure password storage.
 * No external dependencies required.
 */
import crypto from "crypto";

const ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";
const SALT_LENGTH = 32;

/**
 * Hash a plain-text password.
 * Returns a string in the format: `salt:hash` (both hex-encoded).
 */
export async function hashPassword(plain: string): Promise<string> {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const hash = await new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(plain, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, key) => {
      if (err) reject(err);
      else resolve(key.toString("hex"));
    });
  });
  return `${salt}:${hash}`;
}

/**
 * Verify a plain-text password against a stored hash.
 * Supports both new hashed format (`salt:hash`) and legacy plain-text
 * passwords (for backward compatibility during migration).
 */
export async function verifyPassword(
  plain: string,
  stored: string
): Promise<boolean> {
  // If the stored value doesn't contain a colon or is shorter than expected,
  // treat it as a legacy plain-text password for backward compatibility.
  if (!stored.includes(":") || stored.length < SALT_LENGTH * 2 + KEY_LENGTH * 2 + 1) {
    return plain === stored;
  }

  const [salt, storedHash] = stored.split(":");
  if (!salt || !storedHash) return false;

  const hash = await new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(plain, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, key) => {
      if (err) reject(err);
      else resolve(key.toString("hex"));
    });
  });

  // Use timing-safe comparison to prevent timing attacks
  try {
    const a = Buffer.from(hash, "hex");
    const b = Buffer.from(storedHash, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Validate password strength.
 * Returns null if valid, or an error message string if invalid.
 */
export function validatePasswordStrength(password: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one digit.";
  }
  return null;
}
