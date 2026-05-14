import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getClientWorkspaceForOperator, requireOperator } from '@/lib/services/portal';

export const dynamic = 'force-dynamic';

export default async function OperatorClientUploadsPage({ params }: { params: { clientId: string } }) {
  const user = await requireOperator();
  const { client, assets } = await getClientWorkspaceForOperator(params.clientId);

  return (
    <AppShell user={user}>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">{client.businessName} Asset Library</h1>
        <div className="mt-6 space-y-3">
          {assets.map((asset) => (
            <div key={asset.id} className="rounded-md border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-950">{asset.fileName}</p>
                  <p className="mt-1 text-sm text-slate-500">{asset.storageKey}</p>
                </div>
                <StatusBadge status={asset.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
