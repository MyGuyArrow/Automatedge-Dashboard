import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { listClientReports, requireClient } from '@/lib/services/portal';

export const dynamic = 'force-dynamic';

export default async function ClientReportsPage() {
  const user = await requireClient();
  const reports = await listClientReports(user.clientRecordId!);

  return (
    <AppShell user={user}>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Reporting</h1>
        <div className="mt-6 space-y-4">
          {reports.map((report) => (
            <article key={report.id} className="rounded-md border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-slate-950">
                    {report.periodStart} to {report.periodEnd}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">{report.clientSummary}</p>
                </div>
                <StatusBadge status={report.status} />
              </div>
            </article>
          ))}
          {!reports.length ? <p className="text-sm text-slate-600">No published reports yet.</p> : null}
        </div>
      </section>
    </AppShell>
  );
}
