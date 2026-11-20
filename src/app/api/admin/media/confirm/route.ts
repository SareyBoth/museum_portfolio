import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { headObject, deleteObject, validateUpload, type MediaKind } from '@/lib/r2';
import { db } from '@/db';
import { mediaAssets } from '@/db/schema';

const confirmSchema = z.object({
  key: z.string().min(1).max(512),
  kind: z.enum(['image', 'video', 'cv']),
  folder: z.string().max(255).optional(),
  originalFilename: z.string().max(512).optional(),
  url: z.string().url(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = confirmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { key, kind, folder, originalFilename, url, width, height } = parsed.data;

  // Verify the object actually exists in R2
  const head = await headObject(key);
  if (!head) {
    return NextResponse.json({ error: 'Object not found in R2' }, { status: 404 });
  }

  // Verify actual content matches policy
  const validation = validateUpload(kind as MediaKind, head.contentType, head.contentLength);
  if (!validation.valid) {
    // Object violates policy - delete it immediately
    await deleteObject(key);
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // Insert into database
  const [asset] = await db
    .insert(mediaAssets)
    .values({
      key,
      url,
      kind,
      folder: folder || null,
      originalFilename: originalFilename || null,
      mimeType: head.contentType,
      sizeBytes: head.contentLength,
      width: width || null,
      height: height || null,
    })
    .returning();

  return NextResponse.json({ asset });
}
