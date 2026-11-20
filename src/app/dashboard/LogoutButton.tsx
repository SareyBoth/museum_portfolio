'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      fullWidth
      loading={loading}
      onClick={handleLogout}
      icon={<LogOut className="w-3.5 h-3.5" style={{ color: '#f87171' }} />}
    >
      {loading ? 'Signing out...' : 'Sign Out'}
    </Button>
  );
}
