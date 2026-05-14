import { AppShell } from '@/components/layout/AppShell';
import { requireAdmin } from '@/lib/services/portal';

export const dynamic = 'force-dynamic';

export default async function OperatorAdminPage() {
  const user = await requireAdmin();

  return (
    <AppShell user={user}>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Admin</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Admin users can create operators, manage users, and perform all operator actions. Use
          <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5">npm run create-admin</code>
          for the first ADMIN record, then manage further users through Airtable or the service layer.
        </p>
      </section>
    </AppShell>
  );
}
