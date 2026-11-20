'use client';

import React, { useCallback, useRef, useState } from 'react';
import { Upload, X, FileImage, FileVideo, FileText, Check } from 'lucide-react';
import styles from './R2Uploader.module.scss';

type MediaKind = 'image' | 'video' | 'cv';

const ACCEPT_MAP: Record<MediaKind, string> = {
  image: 'image/jpeg,image/png,image/webp,image/avif',
  video: 'video/mp4,video/webm,video/quicktime',
  cv: 'application/pdf',
};

const MIME_MAP: Record<MediaKind, string[]> = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  cv: ['application/pdf'],
};

const MAX_SIZE_MAP: Record<MediaKind, number> = {
  image: 15 * 1024 * 1024,
  video: 250 * 1024 * 1024,
  cv: 15 * 1024 * 1024,
};

interface UploadedAsset {
  id: number;
  key: string;
  url: string;
  kind: string;
  mimeType: string;
  sizeBytes: number | null;
}

interface R2UploaderProps {
  kind: MediaKind;
  folder?: string;
  onUploaded: (asset: UploadedAsset) => void;
  className?: string;
}

export function R2Uploader({
  kind,
  folder,
  onUploaded,
  className = '',
}: R2UploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const KindIcon =
    kind === 'image' ? FileImage : kind === 'video' ? FileVideo : FileText;
  const maxMB = Math.round(MAX_SIZE_MAP[kind] / 1024 / 1024);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!MIME_MAP[kind].includes(file.type)) {
        return `Invalid file format (${file.type}). Allowed: ${MIME_MAP[kind].join(', ')}`;
      }
      if (file.size > MAX_SIZE_MAP[kind]) {
        return `File exceeds limit (${Math.round(file.size / 1024 / 1024)}MB). Maximum: ${maxMB}MB`;
      }
      return null;
    },
    [kind, maxMB]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      setError('');
      setDone(false);
      setProgress(0);

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      if (kind === 'image' && file.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(file));
      }

      setUploading(true);

      try {
        // 1. Get presigned upload URL
        const presignRes = await fetch('/api/admin/media/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            contentLength: file.size,
            kind,
            folder,
          }),
        });

        if (!presignRes.ok) {
          const data = await presignRes.json();
          throw new Error(data.error || 'Failed to acquire presigned URL');
        }

        const { uploadUrl, key, publicUrl } = await presignRes.json();

        // 2. Direct upload to Cloudflare R2 with progress tracking
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', uploadUrl);
          xhr.setRequestHeader('Content-Type', file.type);

          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded / e.total) * 100));
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Storage rejected upload (HTTP ${xhr.status})`));
            }
          });

          xhr.addEventListener('error', () =>
            reject(new Error('Network error uploading to object storage'))
          );
          xhr.send(file);
        });

        // 3. Confirm asset registration in database
        const confirmRes = await fetch('/api/admin/media/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key,
            kind,
            folder,
            originalFilename: file.name,
            url: publicUrl,
          }),
        });

        if (!confirmRes.ok) {
          const data = await confirmRes.json();
          throw new Error(data.error || 'Failed to confirm asset in database');
        }

        const { asset } = await confirmRes.json();
        setDone(true);
        onUploaded(asset);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [kind, folder, onUploaded, validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
      e.target.value = '';
    },
    [uploadFile]
  );

  return (
    <div className={[styles.container, className].filter(Boolean).join(' ')}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={[
          styles.dropzone,
          dragOver ? styles.dragOver : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_MAP[kind]}
          onChange={handleFileSelect}
          className={styles.hiddenInput}
        />

        {uploading ? (
          <div className={styles.progressContainer}>
            <div className={styles.progressLabel}>Uploading to R2... {progress}%</div>
            <div className={styles.progressBarBg}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : done ? (
          <div className={styles.completeWrap}>
            <Check className="w-6 h-6 text-emerald-400" />
            <span className={styles.completeText}>Asset synced to R2</span>
          </div>
        ) : (
          <div className={styles.content}>
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Upload preview" className={styles.previewImage} />
            ) : (
              <div className={styles.iconWrap}>
                <KindIcon className="w-7 h-7" />
              </div>
            )}
            <div>
              <p className={styles.primaryText}>
                <Upload className="w-3.5 h-3.5" />
                <span>Drop file or browse</span>
              </p>
              <p className={styles.subText}>
                Max {maxMB}MB · {MIME_MAP[kind].map((m) => m.split('/')[1]).join(', ')}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className={styles.errorAlert} role="alert">
          <X className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
