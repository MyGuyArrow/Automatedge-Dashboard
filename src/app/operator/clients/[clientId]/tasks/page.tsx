import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getClientWorkspaceForOperator, requireOperator } from '@/lib/services/portal';

export const dynamic = 'force-dynamic';

export default async function OperatorClientTasksPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const user = await requireOperator();
  const { client, tasks } = await getClientWorkspaceForOperator(clientId);

  return (
    <AppShell user={user}>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">{client.businessName} Tasks</h1>
        <div className="mt-6 space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-md border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-950">{task.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                </div>
                <StatusBadge status={task.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
