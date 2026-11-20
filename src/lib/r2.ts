import 'server-only';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// MIME type and size constraints per media kind
export const UPLOAD_CONSTRAINTS = {
  image: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    maxBytes: 15 * 1024 * 1024, // 15 MB
  },
  video: {
    mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    maxBytes: 250 * 1024 * 1024, // 250 MB
  },
  cv: {
    mimeTypes: ['application/pdf'],
    maxBytes: 15 * 1024 * 1024, // 15 MB
  },
} as const;

export type MediaKind = keyof typeof UPLOAD_CONSTRAINTS;

function getS3Client(): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

/**
 * Sanitize an R2 object key to prevent path traversal.
 * Strips leading slashes, .., and null bytes.
 */
export function sanitizeKey(key: string): string {
  return key
    .replace(/\0/g, '')
    .replace(/\.\./g, '')
    .replace(/^\/+/, '')
    .replace(/\/\/+/g, '/');
}

/**
 * Validate MIME type and size for a given media kind.
 */
export function validateUpload(
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
      error: `Invalid content type "${contentType}" for ${kind}. Allowed: ${constraints.mimeTypes.join(', ')}`,
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

/**
 * Generate a presigned PUT URL for direct browser-to-R2 upload.
 * ContentLength and ContentType are signed into the URL.
 */
export async function generatePresignedUploadUrl(params: {
  key: string;
  contentType: string;
  contentLength: number;
}): Promise<{ uploadUrl: string; expiresIn: number }> {
  const client = getS3Client();
  const bucket = process.env.R2_BUCKET_NAME!;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: params.key,
    ContentType: params.contentType,
    ContentLength: params.contentLength,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });
  return { uploadUrl, expiresIn: 300 };
}

/**
 * Verify an uploaded object via HeadObject.
 * Returns the actual ContentLength and ContentType.
 */
export async function headObject(key: string): Promise<{
  contentLength: number;
  contentType: string;
} | null> {
  const client = getS3Client();
  const bucket = process.env.R2_BUCKET_NAME!;

  try {
    const result = await client.send(
      new HeadObjectCommand({ Bucket: bucket, Key: key })
    );
    return {
      contentLength: result.ContentLength ?? 0,
      contentType: result.ContentType ?? '',
    };
  } catch {
    return null;
  }
}

/**
 * Delete an object from R2.
 */
export async function deleteObject(key: string): Promise<void> {
  const client = getS3Client();
  const bucket = process.env.R2_BUCKET_NAME!;
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

/**
 * Build the public URL for an R2 object.
 */
export function getPublicUrl(key: string): string {
  const baseUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');
  return `${baseUrl}/${key}`;
}
