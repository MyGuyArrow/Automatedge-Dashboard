'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const result = await signIn('credentials', {
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || ''),
      redirect: false,
      callbackUrl: searchParams.get('callbackUrl') || '/',
    });

    setLoading(false);
    if (result?.error) {
      setError('Invalid credentials or disabled account.');
      return;
    }
    router.push(result?.url || '/');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-fg" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 w-full rounded-none border border-line bg-bg px-4 py-3 text-sm text-fg outline-none transition-colors focus:border-fg"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-fg" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-none border border-line bg-bg px-4 py-3 text-sm text-fg outline-none transition-colors focus:border-fg"
        />
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="ae-action w-full px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
