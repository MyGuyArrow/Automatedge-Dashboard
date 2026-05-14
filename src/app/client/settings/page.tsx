import { AppShell } from '@/components/layout/AppShell';
import { requireClient } from '@/lib/services/portal';

export const dynamic = 'force-dynamic';

export default async function ClientSettingsPage() {
  const user = await requireClient();

  return (
    <AppShell user={user}>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Settings</h1>
        <dl className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-500">Name</dt>
            <dd className="mt-1 text-slate-950">{user.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Email</dt>
            <dd className="mt-1 text-slate-950">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Role</dt>
            <dd className="mt-1 text-slate-950">{user.role}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Workspace</dt>
            <dd className="mt-1 text-slate-950">{user.clientRecordId}</dd>
          </div>
        </dl>
      </section>
    </AppShell>
  );
}
