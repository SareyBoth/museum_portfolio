import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import {
  validateUpload,
  sanitizeKey,
  generatePresignedUploadUrl,
  getPublicUrl,
  type MediaKind,
} from '@/lib/r2';

const presignSchema = z.object({
  filename: z.string().min(1).max(512),
  contentType: z.string().min(1).max(128),
  contentLength: z.number().int().positive(),
  kind: z.enum(['image', 'video', 'cv']),
  folder: z.string().max(255).optional(),
});

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = presignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { filename, contentType, contentLength, kind, folder } = parsed.data;

  // Validate MIME type and size
  const validation = validateUpload(kind as MediaKind, contentType, contentLength);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // Build a safe key: folder/timestamp-sanitized_filename
  const timestamp = Date.now();
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 200);
  const prefix = folder ? `${sanitizeKey(folder)}/` : '';
  const key = sanitizeKey(`${prefix}${timestamp}-${safeName}`);
  const publicUrl = getPublicUrl(key);

  const { uploadUrl, expiresIn } = await generatePresignedUploadUrl({
    key,
    contentType,
    contentLength,
  });

  return NextResponse.json({ uploadUrl, key, publicUrl, expiresIn });
}
