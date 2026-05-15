import Link from 'next/link';

import { OperatorClientTable } from '@/components/dashboard/OperatorClientTable';
import { OperatorSummaryCards } from '@/components/dashboard/OperatorSummaryCards';
import { AppShell } from '@/components/layout/AppShell';
import { getOperatorSummary, listOperatorClients, requireOperator } from '@/lib/services/portal';

export const dynamic = 'force-dynamic';

export default async function OperatorClientsPage() {
  const user = await requireOperator();
  const [summary, clients] = await Promise.all([getOperatorSummary(), listOperatorClients()]);

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Operator Control Panel
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Client Operations</h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage fulfilment workspaces, build status, tasks, reports, assets, and access blockers.
            </p>
          </div>
          <Link
            href="/operator/clients/new"
            className="ae-action px-5 py-2.5 text-sm font-semibold"
          >
            New client
          </Link>
        </div>
        <OperatorSummaryCards summary={summary} />
        <OperatorClientTable clients={clients} />
      </div>
    </AppShell>
  );
}
