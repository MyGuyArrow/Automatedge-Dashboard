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
    <div className="min-h-screen bg-bg text-fg operational-grid">
      <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 md:px-10">
          <Link href={user.role === 'CLIENT' ? '/client/dashboard' : '/operator/clients'} className="min-w-0">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-fg">
                AUTOMATEDGE
              </p>
              <h1 className="mt-1 text-xs uppercase tracking-[0.24em] text-muted">Fulfilment Portal</h1>
            </div>
          </Link>
          <div className="flex items-center gap-3 text-sm text-muted">
            <span className="hidden sm:inline">{user.name || user.email}</span>
            <Link
              href="/logout"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-bg text-fg transition-colors hover:bg-fg hover:text-bg"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1280px] gap-2 overflow-x-auto px-6 pb-3 md:px-10">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-line hover:text-fg"
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-[1280px] px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}
