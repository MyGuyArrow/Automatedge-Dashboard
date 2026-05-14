import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/auth/LoginForm';
import { getCurrentUser, roleHomePath } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(roleHomePath(user.role));

  return (
    <main className="flex min-h-screen bg-white">
      <section className="hidden flex-1 border-r border-slate-200 bg-slate-950 p-12 text-white lg:block">
        <div className="flex h-full max-w-xl flex-col justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">
              AutomatEdge
            </p>
            <h1 className="mt-6 text-5xl font-semibold tracking-normal">Fulfilment Portal</h1>
            <p className="mt-5 max-w-md text-lg leading-8 text-slate-300">
              Revenue Engine build status, asset collection, access requirements, and reporting in one operational workspace.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-300">For closed and paid clients only.</p>
            <p className="mt-2 text-sm text-slate-400">
              Client workspaces are assigned by AutomatEdge operators after sale.
            </p>
          </div>
        </div>
      </section>
      <section className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-10 operational-grid">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Revenue Engine
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">Sign in</h2>
          <p className="mt-2 text-sm text-slate-600">
            Use the account created by AutomatEdge for your fulfilment workspace.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
