import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getClientWorkspaceForOperator, requireOperator } from '@/lib/services/portal';

export const dynamic = 'force-dynamic';

export default async function OperatorClientReportsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const user = await requireOperator();
  const { client, reports } = await getClientWorkspaceForOperator(clientId);

  return (
    <AppShell user={user}>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">{client.businessName} Reports</h1>
        <div className="mt-6 space-y-4">
          {reports.map((report) => (
            <article key={report.id} className="rounded-md border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-950">
                    {report.periodStart} to {report.periodEnd}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{report.operatorSummary}</p>
                </div>
                <StatusBadge status={report.status} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
