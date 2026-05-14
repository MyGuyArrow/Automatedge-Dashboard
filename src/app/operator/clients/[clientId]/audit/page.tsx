import { AppShell } from '@/components/layout/AppShell';
import { getClientWorkspaceForOperator, requireOperator } from '@/lib/services/portal';

export const dynamic = 'force-dynamic';

export default async function OperatorClientAuditPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const user = await requireOperator();
  const { client, auditScores } = await getClientWorkspaceForOperator(clientId);

  return (
    <AppShell user={user}>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">{client.businessName} Funnel Health Audits</h1>
        <div className="mt-6 space-y-4">
          {auditScores.map((score) => (
            <article key={score.id} className="rounded-md border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-950">Total Score: {score.totalScore ?? 'Not scored'}</p>
                  <p className="mt-2 text-sm text-slate-600">{score.recommendedFix}</p>
                </div>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                  {score.visibleToClient ? 'Visible' : 'Internal'}
                </span>
              </div>
            </article>
          ))}
          {!auditScores.length ? <p className="text-sm text-slate-600">No audit scores recorded yet.</p> : null}
        </div>
      </section>
    </AppShell>
  );
}
