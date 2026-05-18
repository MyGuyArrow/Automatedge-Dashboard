'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type AcceptInviteFormProps = {
  token: string;
  email: string;
};

export function AcceptInviteForm({ token, email }: AcceptInviteFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password') || '');
    const confirmPassword = String(formData.get('confirmPassword') || '');

    if (password.length < 12) {
      setLoading(false);
      setError('Password must be at least 12 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      setError('Passwords do not match.');
      return;
    }

    const response = await fetch('/api/invites/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password, confirmPassword }),
    });
    const body = (await response.json().catch(() => null)) as
      | { email?: string; redirectTo?: string; error?: string }
      | null;

    if (!response.ok || !body?.email) {
      setLoading(false);
      setError(body?.error || 'Unable to accept this invite.');
      return;
    }

    const signInResult = await signIn('credentials', {
      email: body.email,
      password,
      redirect: false,
      callbackUrl: body.redirectTo || '/client/uploads',
    });

    setLoading(false);

    if (signInResult?.error) {
      setError('Your password was set. Please sign in with your new password.');
      return;
    }

    router.push(signInResult?.url || '/client/uploads');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div>
        <label className="text-sm font-medium text-fg" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          value={email}
          disabled
          className="mt-2 w-full rounded-none border border-line bg-bg px-4 py-3 text-sm text-muted"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-fg" htmlFor="password">
          Create password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          className="mt-2 w-full rounded-none border border-line bg-bg px-4 py-3 text-sm text-fg outline-none transition-colors focus:border-fg"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-fg" htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          className="mt-2 w-full rounded-none border border-line bg-bg px-4 py-3 text-sm text-fg outline-none transition-colors focus:border-fg"
        />
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="ae-action w-full px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}
