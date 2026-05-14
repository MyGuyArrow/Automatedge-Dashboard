import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getClientWorkspaceForOperator, requireOperator } from '@/lib/services/portal';

export const dynamic = 'force-dynamic';

export default async function OperatorClientBuildPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const user = await requireOperator();
  const { client, buildPhases } = await getClientWorkspaceForOperator(clientId);

  return (
    <AppShell user={user}>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">{client.businessName} Build Status</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {buildPhases.map((phase) => (
            <div key={phase.id} className="rounded-md border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium text-slate-950">{phase.sortOrder}. {phase.title}</p>
                <StatusBadge status={phase.status} />
              </div>
              <p className="mt-2 text-sm text-slate-600">{phase.description}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
