'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function LogoutPage() {
  useEffect(() => {
    void signOut({ callbackUrl: '/login' });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
      Signing out...
    </main>
  );
}
