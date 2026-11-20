import { describe, it, expect } from 'vitest';

// Test R2 validation and sanitization logic directly (no server-only imports)
const UPLOAD_CONSTRAINTS = {
  image: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    maxBytes: 15 * 1024 * 1024,
  },
  video: {
    mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    maxBytes: 250 * 1024 * 1024,
  },
  cv: {
    mimeTypes: ['application/pdf'],
    maxBytes: 15 * 1024 * 1024,
  },
} as const;

type MediaKind = keyof typeof UPLOAD_CONSTRAINTS;

function sanitizeKey(key: string): string {
  return key
    .replace(/\0/g, '')
    .replace(/\.\./g, '')
    .replace(/^\/+/, '')
    .replace(/\/\/+/g, '/');
}

function validateUpload(
  kind: MediaKind,
  contentType: string,
  contentLength: number
): { valid: boolean; error?: string } {
  const constraints = UPLOAD_CONSTRAINTS[kind];
  if (!constraints) {
    return { valid: false, error: `Invalid media kind: ${kind}` };
  }

  const allowedTypes: readonly string[] = constraints.mimeTypes;
  if (!allowedTypes.includes(contentType)) {
    return {
      valid: false,
      error: `Invalid content type "${contentType}" for ${kind}. Allowed: ${allowedTypes.join(', ')}`,
    };
  }

  if (contentLength > constraints.maxBytes) {
    return {
      valid: false,
      error: `File too large (${Math.round(contentLength / 1024 / 1024)}MB). Max: ${Math.round(constraints.maxBytes / 1024 / 1024)}MB`,
    };
  }

  return { valid: true };
}

describe('R2 Key Sanitization', () => {
  it('strips directory traversal sequences', () => {
    expect(sanitizeKey('../../../secret.txt')).toBe('secret.txt');
    expect(sanitizeKey('folder/../../nested/file.jpg')).toBe('folder/nested/file.jpg');
  });

  it('strips leading slashes', () => {
    expect(sanitizeKey('/uploads/photo.jpg')).toBe('uploads/photo.jpg');
    expect(sanitizeKey('///root/photo.jpg')).toBe('root/photo.jpg');
  });

  it('collapses multiple consecutive slashes', () => {
    expect(sanitizeKey('folder//subfolder///file.mp4')).toBe('folder/subfolder/file.mp4');
  });

  it('strips null bytes', () => {
    expect(sanitizeKey('file\0.jpg')).toBe('file.jpg');
  });
});

describe('R2 Upload Validation', () => {
  it('accepts valid images within 15MB', () => {
    const res = validateUpload('image', 'image/jpeg', 5 * 1024 * 1024);
    expect(res.valid).toBe(true);
  });

  it('rejects oversized images (>15MB)', () => {
    const res = validateUpload('image', 'image/jpeg', 16 * 1024 * 1024);
    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/too large/i);
  });

  it('rejects disallowed image mime types', () => {
    const res = validateUpload('image', 'image/gif', 1024);
    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/invalid content type/i);
  });

  it('accepts videos up to 250MB', () => {
    const res = validateUpload('video', 'video/mp4', 200 * 1024 * 1024);
    expect(res.valid).toBe(true);
  });

  it('rejects videos over 250MB', () => {
    const res = validateUpload('video', 'video/mp4', 260 * 1024 * 1024);
    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/too large/i);
  });

  it('accepts valid PDF CVs up to 15MB', () => {
    const res = validateUpload('cv', 'application/pdf', 2 * 1024 * 1024);
    expect(res.valid).toBe(true);
  });

  it('rejects non-PDF files for CV', () => {
    const res = validateUpload('cv', 'application/msword', 1024);
    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/invalid content type/i);
  });
});
