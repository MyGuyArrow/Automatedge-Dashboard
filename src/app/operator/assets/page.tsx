import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getOperatorSummary, requireOperator } from '@/lib/services/portal';

export const dynamic = 'force-dynamic';

export default async function OperatorAssetsPage() {
  const user = await requireOperator();
  const summary = await getOperatorSummary();

  return (
    <AppShell user={user}>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Recently Uploaded Assets</h1>
        <div className="mt-6 space-y-3">
          {summary.recentlyUploadedAssets.map((asset) => (
            <div key={asset.id} className="rounded-md border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-950">{asset.fileName}</p>
                  <p className="mt-1 text-sm text-slate-500">{asset.clientRecordId}</p>
                </div>
                <StatusBadge status={asset.status} />
              </div>
            </div>
          ))}
          {!summary.recentlyUploadedAssets.length ? <p className="text-sm text-slate-600">No uploaded assets awaiting review.</p> : null}
        </div>
      </section>
    </AppShell>
  );
}
