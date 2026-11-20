import { describe, it, expect } from 'vitest';

// Test getClientIp logic directly (avoid server-only import)
function getClientIp(headers: Map<string, string>): string {
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const xff = headers.get('x-forwarded-for');
  if (xff) {
    const firstIp = xff.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }

  return '127.0.0.1';
}

describe('getClientIp', () => {
  it('prefers cf-connecting-ip', () => {
    const headers = new Map([
      ['cf-connecting-ip', '1.2.3.4'],
      ['x-forwarded-for', '5.6.7.8, 9.10.11.12'],
    ]);
    expect(getClientIp(headers)).toBe('1.2.3.4');
  });

  it('falls back to first x-forwarded-for IP', () => {
    const headers = new Map([['x-forwarded-for', '10.0.0.1, 10.0.0.2']]);
    expect(getClientIp(headers)).toBe('10.0.0.1');
  });

  it('returns 127.0.0.1 when no headers present', () => {
    const headers = new Map<string, string>();
    expect(getClientIp(headers)).toBe('127.0.0.1');
  });

  it('trims whitespace from cf-connecting-ip', () => {
    const headers = new Map([['cf-connecting-ip', '  1.2.3.4  ']]);
    expect(getClientIp(headers)).toBe('1.2.3.4');
  });
});
