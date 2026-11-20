import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { LoginForm } from './LoginForm';

export const metadata = {
  title: 'Admin Login',
};

async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const admin = await getCurrentAdmin();
  const params = await searchParams;

  if (admin) {
    redirect(params.next || '/dashboard');
  }

  return <LoginForm redirectTo={params.next} />;
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#060709] font-mono text-xs text-[var(--museum-ash)]">
          Loading...
        </div>
      }
    >
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}
