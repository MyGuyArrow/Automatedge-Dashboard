import Link from 'next/link';
import { LogOut } from 'lucide-react';

import type { CurrentUser } from '@/lib/auth/session';

const clientLinks = [
  ['/client/dashboard', 'Dashboard'],
  ['/client/intake', 'Intake'],
  ['/client/uploads', 'Uploads'],
  ['/client/access', 'Access'],
  ['/client/tasks', 'Tasks'],
  ['/client/reports', 'Reports'],
];

const operatorLinks = [
  ['/operator/clients', 'Clients'],
  ['/operator/tasks', 'Tasks'],
  ['/operator/reports', 'Reports'],
  ['/operator/assets', 'Assets'],
  ['/operator/admin', 'Admin'],
];

export function AppShell({
  user,
  children,
}: {
  user: CurrentUser;
  children: React.ReactNode;
}) {
  const links = user.role === 'CLIENT' ? clientLinks : operatorLinks;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href={user.role === 'CLIENT' ? '/client/dashboard' : '/operator/clients'}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
                AutomatEdge
              </p>
              <h1 className="text-lg font-semibold text-slate-950">Fulfilment Portal</h1>
            </div>
          </Link>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="hidden sm:inline">{user.name || user.email}</span>
            <Link
              href="/logout"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6 lg:px-8">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
