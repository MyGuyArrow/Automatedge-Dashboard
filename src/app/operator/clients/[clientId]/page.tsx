import Link from 'next/link';

import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getClientWorkspaceForOperator, requireOperator } from '@/lib/services/portal';

export const dynamic = 'force-dynamic';

const tabs = ['intake', 'uploads', 'access', 'build', 'tasks', 'reports', 'audit', 'notes'];

export default async function OperatorClientDetailPage({
  params,
}: {
  params: { clientId: string };
}) {
  const user = await requireOperator();
  const workspace = await getClientWorkspaceForOperator(params.clientId);

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                Client Workspace
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">
                {workspace.client.businessName}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                {workspace.client.primaryContactName} · {workspace.client.primaryContactEmail}
              </p>
            </div>
            <StatusBadge status={workspace.client.status} />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <Link
                key={tab}
                href={`/operator/clients/${params.clientId}/${tab}`}
                className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {tab[0].toUpperCase() + tab.slice(1)}
              </Link>
            ))}
          </div>
        </section>
        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Assets</p>
            <p className="mt-2 text-2xl font-semibold">{workspace.assets.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Access Requests</p>
            <p className="mt-2 text-2xl font-semibold">{workspace.accessRequests.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Tasks</p>
            <p className="mt-2 text-2xl font-semibold">{workspace.tasks.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Reports</p>
            <p className="mt-2 text-2xl font-semibold">{workspace.reports.length}</p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
