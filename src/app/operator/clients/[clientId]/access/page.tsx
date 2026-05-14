import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ACCESS_SAFETY_WARNING } from '@/lib/constants';
import { getClientWorkspaceForOperator, requireOperator } from '@/lib/services/portal';

export const dynamic = 'force-dynamic';

export default async function OperatorClientAccessPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const user = await requireOperator();
  const { client, accessRequests } = await getClientWorkspaceForOperator(clientId);

  return (
    <AppShell user={user}>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">{client.businessName} Access Requirements</h1>
        <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {ACCESS_SAFETY_WARNING}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {accessRequests.map((request) => (
            <div key={request.id} className="rounded-md border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-950">{request.platformName || request.platform}</p>
                  <p className="mt-1 text-sm text-slate-600">{request.instructions}</p>
                </div>
                <StatusBadge status={request.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
