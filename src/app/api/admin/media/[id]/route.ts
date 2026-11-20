import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { deleteObject } from '@/lib/r2';
import { db } from '@/db';
import { mediaAssets, projects, siteProfile } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { invalidatePortfolioCache } from '@/lib/cache';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const assetId = parseInt(id, 10);
  if (isNaN(assetId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  // Find the asset
  const [asset] = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.id, assetId))
    .limit(1);

  if (!asset) {
    return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
  }

  // Null out referencing FKs
  await db
    .update(projects)
    .set({ thumbnailAssetId: null })
    .where(eq(projects.thumbnailAssetId, assetId));
  await db
    .update(projects)
    .set({ videoAssetId: null })
    .where(eq(projects.videoAssetId, assetId));
  await db
    .update(siteProfile)
    .set({ portraitAssetId: null })
    .where(eq(siteProfile.portraitAssetId, assetId));
  await db
    .update(siteProfile)
    .set({ cvAssetId: null })
    .where(eq(siteProfile.cvAssetId, assetId));

  // Delete from R2
  try {
    await deleteObject(asset.key);
  } catch {
    // R2 delete failed but continue with DB cleanup
  }

  // Delete from DB
  await db.delete(mediaAssets).where(eq(mediaAssets.id, assetId));

  // Invalidate cache
  await invalidatePortfolioCache();

  return NextResponse.json({ ok: true });
}
