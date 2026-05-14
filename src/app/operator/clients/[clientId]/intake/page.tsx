import { AppShell } from '@/components/layout/AppShell';
import { getClientWorkspaceForOperator, requireOperator } from '@/lib/services/portal';

export const dynamic = 'force-dynamic';

export default async function OperatorClientIntakePage({ params }: { params: { clientId: string } }) {
  const user = await requireOperator();
  const { client, intake } = await getClientWorkspaceForOperator(params.clientId);

  return (
    <AppShell user={user}>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">{client.businessName} Intake</h1>
        <pre className="mt-6 max-h-[680px] overflow-auto rounded-md bg-slate-950 p-4 text-xs text-slate-100">
          {JSON.stringify(intake?.fields || {}, null, 2)}
        </pre>
      </section>
    </AppShell>
  );
}
