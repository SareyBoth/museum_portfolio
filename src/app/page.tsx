import { Suspense } from 'react';
import { getPortfolioData } from '@/lib/portfolio';
import { GalleryClient } from './GalleryClient';

async function GalleryDataLoader() {
  const initialData = await getPortfolioData();
  return <GalleryClient initialData={initialData} />;
}

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full bg-[#060709] flex items-center justify-center font-mono text-xs text-[var(--museum-ash)]">
          Loading gallery...
        </div>
      }
    >
      <GalleryDataLoader />
    </Suspense>
  );
}
