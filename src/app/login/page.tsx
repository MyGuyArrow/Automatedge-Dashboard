import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/auth/LoginForm';
import { getCurrentUser, roleHomePath } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(roleHomePath(user.role));

  return (
    <main className="flex min-h-screen bg-bg text-fg">
      <section className="hero-stage operational-grid hidden flex-1 border-r border-line bg-fg p-12 text-bg lg:block">
        <div className="relative z-10 flex h-full max-w-xl flex-col justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-bg/70">
              AUTOMATEDGE
            </p>
            <h1 className="mt-6 text-5xl font-extrabold leading-[0.92] tracking-normal">
              Fulfilment
              <br />
              Portal
            </h1>
            <p className="mt-6 max-w-md text-base leading-8 text-bg/60">
              Revenue Engine build status, asset collection, access requirements, and reporting in one operational workspace.
            </p>
          </div>
          <div className="border border-bg/15 bg-bg/5 p-5">
            <p className="text-sm text-bg/70">For closed and paid clients only.</p>
            <p className="mt-2 text-sm text-bg/50">
              Client workspaces are assigned by AutomatEdge operators after sale.
            </p>
          </div>
        </div>
      </section>
      <section className="flex flex-1 items-center justify-center bg-bg px-6 py-10 operational-grid">
        <div className="ae-panel w-full max-w-md p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
            Revenue Engine
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal text-fg">Sign in</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
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
