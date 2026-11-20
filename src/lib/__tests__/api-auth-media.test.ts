import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Contact form schema validation test
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Valid email is required').max(255),
  service: z.string().max(255).optional(),
  message: z.string().min(5, 'Message must be at least 5 characters').max(5000),
});

describe('Contact Form Validation', () => {
  it('accepts valid contact submissions', () => {
    const valid = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      service: 'Video Editing',
      message: 'Looking for a commercial video editor for a 60s reel.',
    };
    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const invalid = {
      name: 'Jane',
      email: 'not-an-email',
      message: 'Hello there, this is a message.',
    };
    const result = contactSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects short messages (<5 chars)', () => {
    const invalid = {
      name: 'Jane',
      email: 'jane@example.com',
      message: 'Hi',
    };
    const result = contactSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects missing name', () => {
    const invalid = {
      name: '',
      email: 'jane@example.com',
      message: 'Hello there, this is a test message.',
    };
    const result = contactSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

// Presign schema validation test
const presignSchema = z.object({
  filename: z.string().min(1).max(512),
  contentType: z.string().min(1).max(128),
  contentLength: z.number().int().positive(),
  kind: z.enum(['image', 'video', 'cv']),
  folder: z.string().max(255).optional(),
});

describe('Presign Request Validation', () => {
  it('accepts valid presign payload', () => {
    const payload = {
      filename: 'hero-banner.webp',
      contentType: 'image/webp',
      contentLength: 1024 * 1024,
      kind: 'image' as const,
      folder: 'works/posters',
    };
    expect(presignSchema.safeParse(payload).success).toBe(true);
  });

  it('rejects invalid kind enum', () => {
    const payload = {
      filename: 'document.docx',
      contentType: 'application/msword',
      contentLength: 1024,
      kind: 'document',
    };
    expect(presignSchema.safeParse(payload).success).toBe(false);
  });

  it('rejects negative content length', () => {
    const payload = {
      filename: 'video.mp4',
      contentType: 'video/mp4',
      contentLength: -100,
      kind: 'video' as const,
    };
    expect(presignSchema.safeParse(payload).success).toBe(false);
  });
});
