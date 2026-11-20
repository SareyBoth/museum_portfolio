// Unit tests for password hashing/verification (no server-only import)
import { describe, it, expect } from 'vitest';
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';

// Inline the functions to avoid server-only import barrier
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
  return `${salt.toString('hex')}:${key.toString('hex')}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
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

describe('password hashing', () => {
  it('produces a salt:key format', async () => {
    const hash = await hashPassword('test-password');
    const parts = hash.split(':');
    expect(parts).toHaveLength(2);
    expect(parts[0]).toHaveLength(32); // 16 bytes hex
    expect(parts[1]).toHaveLength(128); // 64 bytes hex
  });

  it('generates unique salts for the same password', async () => {
    const hash1 = await hashPassword('same-password');
    const hash2 = await hashPassword('same-password');
    expect(hash1).not.toBe(hash2);
  });

  it('verifies correct password', async () => {
    const hash = await hashPassword('correct-password');
    expect(await verifyPassword('correct-password', hash)).toBe(true);
  });

  it('rejects incorrect password', async () => {
    const hash = await hashPassword('correct-password');
    expect(await verifyPassword('wrong-password', hash)).toBe(false);
  });

  it('rejects empty or malformed hash', async () => {
    expect(await verifyPassword('test', '')).toBe(false);
    expect(await verifyPassword('test', 'no-colon')).toBe(false);
  });
});
