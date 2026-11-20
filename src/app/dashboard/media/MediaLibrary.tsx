'use client';

import React, { useState } from 'react';
import { R2Uploader } from '@/components/dashboard/R2Uploader';
import {
  FileImage,
  FileVideo,
  FileText,
  Copy,
  Trash2,
  Check,
  Upload,
  ExternalLink,
  X,
} from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { useAdminToast } from '@/components/admin/ui/Toast';
import styles from './MediaLibrary.module.scss';

interface Asset {
  id: number;
  key: string;
  url: string;
  kind: 'image' | 'video' | 'cv';
  folder: string | null;
  originalFilename: string | null;
  mimeType: string;
  sizeBytes: number | null;
  createdAt: Date;
}

interface MediaLibraryProps {
  initialAssets: Asset[];
  initialUsageCounts: Record<number, number>;
}

export function MediaLibrary({
  initialAssets,
  initialUsageCounts,
}: MediaLibraryProps) {
  const toast = useAdminToast();
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'cv'>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadKind, setUploadKind] = useState<'image' | 'video' | 'cv'>('image');

  // Deletion confirm
  const [deleteTargetAsset, setDeleteTargetAsset] = useState<Asset | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = filter === 'all' ? assets : assets.filter((a) => a.kind === filter);

  const handleCopy = async (id: number, url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('R2 Public URL copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmDelete = async () => {
    if (!deleteTargetAsset) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/media/${deleteTargetAsset.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      setAssets((prev) => prev.filter((a) => a.id !== deleteTargetAsset.id));
      toast.success('Asset deleted from R2 and database.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
      setDeleteTargetAsset(null);
    }
  };

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return '—';
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={styles.container}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.filterTabs}>
          {(['all', 'image', 'video', 'cv'] as const).map((tab) => {
            const count =
              tab === 'all'
                ? assets.length
                : assets.filter((a) => a.kind === tab).length;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={[
                  styles.filterBtn,
                  filter === tab ? styles.active : '',
                ].join(' ')}
              >
                {tab === 'all'
                  ? `All Assets (${count})`
                  : tab === 'image'
                    ? `Images (${count})`
                    : tab === 'video'
                      ? `Videos (${count})`
                      : `CV / PDF (${count})`}
              </button>
            );
          })}
        </div>

        <Button
          variant={showUpload ? 'secondary' : 'primary'}
          onClick={() => setShowUpload(!showUpload)}
          icon={showUpload ? <X className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
        >
          {showUpload ? 'Close Uploader' : 'Upload to R2'}
        </Button>
      </div>

      {/* Upload Zone */}
      {showUpload && (
        <div className={styles.uploadCard}>
          <div className={styles.uploadHeader}>
            <h3 className={styles.uploadTitle}>Upload Asset to Cloudflare R2</h3>
            <div className={styles.kindTabs}>
              {(['image', 'video', 'cv'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setUploadKind(k)}
                  className={[
                    styles.filterBtn,
                    uploadKind === k ? styles.active : '',
                  ].join(' ')}
                >
                  {k.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <R2Uploader
            kind={uploadKind}
            folder={uploadKind === 'cv' ? 'cv' : uploadKind === 'image' ? 'images' : 'videos'}
            onUploaded={(asset) => {
              setAssets((prev) => [
                {
                  id: asset.id,
                  key: asset.key,
                  url: asset.url,
                  kind: asset.kind as 'image' | 'video' | 'cv',
                  folder: null,
                  originalFilename: null,
                  mimeType: asset.mimeType,
                  sizeBytes: asset.sizeBytes,
                  createdAt: new Date(),
                },
                ...prev,
              ]);
              toast.success('Asset uploaded and registered in library.');
            }}
          />
        </div>
      )}

      {/* Assets Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileImage className="w-6 h-6" />}
          title="No Media Assets Found"
          description="Upload exhibition poster images, 35mm frame captures, commercial reels, or PDF CV documents."
          action={
            <Button variant="secondary" size="sm" onClick={() => setShowUpload(true)}>
              Upload First Asset
            </Button>
          }
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map((asset) => {
            const usages = initialUsageCounts[asset.id] || 0;
            const isImage = asset.kind === 'image';
            const isVideo = asset.kind === 'video';
            const isCopied = copiedId === asset.id;

            return (
              <div key={asset.id} className={styles.assetCard}>
                <div className={styles.previewWrap}>
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset.url}
                      alt={asset.originalFilename || asset.key}
                      className={styles.previewImg}
                    />
                  ) : (
                    <div className={styles.previewFallback}>
                      {isVideo ? (
                        <FileVideo className="w-10 h-10 text-[var(--museum-ash)]" />
                      ) : (
                        <FileText className="w-10 h-10 text-[var(--museum-ash)]" />
                      )}
                      <span>{asset.mimeType}</span>
                    </div>
                  )}

                  <div className={styles.kindPill}>
                    <Badge variant="neutral">{asset.kind}</Badge>
                  </div>

                  <div className={styles.usagePill}>
                    <Badge variant={usages > 0 ? 'gold' : 'neutral'}>
                      {usages > 0 ? `Used in ${usages}` : 'Unreferenced'}
                    </Badge>
                  </div>
                </div>

                <div className={styles.assetInfo}>
                  <p className={styles.filename} title={asset.originalFilename || asset.key}>
                    {asset.originalFilename || asset.key.split('/').pop()}
                  </p>
                  <div className={styles.metaLine}>
                    <span>{formatBytes(asset.sizeBytes)}</span>
                    <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className={styles.assetFooter}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(asset.id, asset.url)}
                    icon={
                      isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )
                    }
                  >
                    {isCopied ? 'Copied' : 'Copy URL'}
                  </Button>

                  <div className={styles.assetActions}>
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none' }}
                      aria-label="View asset in new tab"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon={<ExternalLink className="w-3.5 h-3.5" />}
                      />
                    </a>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteTargetAsset(asset)}
                      icon={<Trash2 className="w-3.5 h-3.5" />}
                      aria-label="Delete asset"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteTargetAsset !== null}
        title="Delete Media Asset?"
        message={
          deleteTargetAsset && (initialUsageCounts[deleteTargetAsset.id] || 0) > 0
            ? `Warning: This asset is currently referenced by ${initialUsageCounts[deleteTargetAsset.id]} portfolio items. Deleting it will null out those references.`
            : 'This asset will be permanently purged from Cloudflare R2 and the database registry.'
        }
        confirmLabel="Delete Asset"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetAsset(null)}
      />
    </div>
  );
}
