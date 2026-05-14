import { AppShell } from '@/components/layout/AppShell';
import { getClientWorkspaceForOperator, requireOperator } from '@/lib/services/portal';

export const dynamic = 'force-dynamic';

export default async function OperatorClientNotesPage({ params }: { params: { clientId: string } }) {
  const user = await requireOperator();
  const { client, internalNotes } = await getClientWorkspaceForOperator(params.clientId);

  return (
    <AppShell user={user}>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">{client.businessName} Internal Notes</h1>
        <p className="mt-2 text-sm text-slate-600">Operator-only. Clients have no route or service access.</p>
        <div className="mt-6 space-y-3">
          {internalNotes.map((note) => (
            <article key={note.id} className="rounded-md border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{note.category}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{note.note}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
