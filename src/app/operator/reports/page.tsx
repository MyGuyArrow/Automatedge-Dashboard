import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getOperatorSummary, requireOperator } from '@/lib/services/portal';

export const dynamic = 'force-dynamic';

export default async function OperatorReportsPage() {
  const user = await requireOperator();
  const summary = await getOperatorSummary();

  return (
    <AppShell user={user}>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Draft and Unpublished Reports</h1>
        <div className="mt-6 space-y-3">
          {summary.unpublishedReports.map((report) => (
            <div key={report.id} className="rounded-md border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium text-slate-950">
                  {report.periodStart} to {report.periodEnd}
                </p>
                <StatusBadge status={report.status} />
              </div>
            </div>
          ))}
          {!summary.unpublishedReports.length ? <p className="text-sm text-slate-600">No unpublished reports.</p> : null}
        </div>
      </section>
    </AppShell>
  );
}
