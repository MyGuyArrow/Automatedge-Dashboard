import { AssetUploadForm } from '@/components/dashboard/AssetUploadForm';
import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { listClientAssets, requireClient } from '@/lib/services/portal';

export const dynamic = 'force-dynamic';

export default async function ClientUploadsPage() {
  const user = await requireClient();
  const assets = await listClientAssets(user.clientRecordId!);

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <AssetUploadForm clientRecordId={user.clientRecordId!} />
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-950">Recent Files</h1>
          <div className="mt-5 space-y-3">
            {assets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between gap-4 rounded-md border border-slate-200 p-4">
                <div>
                  <p className="font-medium text-slate-950">{asset.fileName}</p>
                  <p className="mt-1 text-sm text-slate-500">{asset.category.replaceAll('_', ' ')}</p>
                </div>
                <StatusBadge status={asset.status} />
              </div>
            ))}
            {!assets.length ? <p className="text-sm text-slate-600">No uploaded assets yet.</p> : null}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
