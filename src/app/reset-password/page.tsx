import Link from 'next/link';

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Reset password</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Password resets are handled by an AutomatEdge operator in this local MVP. Contact the
          team to rotate your account password securely.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
        >
          Back to login
        </Link>
      </div>
    </main>
  );
}
