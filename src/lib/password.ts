import 'server-only';
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Hash a password with scrypt (16-byte random salt, 64-byte derived key).
 * Returns "hex(salt):hex(key)".
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
  return `${salt.toString('hex')}:${key.toString('hex')}`;
}

/**
 * Verify a password against a stored hash using timingSafeEqual.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [saltHex, keyHex] = storedHash.split(':');
  if (!saltHex || !keyHex) return false;

  const salt = Buffer.from(saltHex, 'hex');
  const storedKey = Buffer.from(keyHex, 'hex');

  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, 64, (err, dk) => {
      if (err) reject(err);
      else resolve(dk);
    });
  });

  if (derivedKey.length !== storedKey.length) return false;
  return timingSafeEqual(derivedKey, storedKey);
}
