import { AppShell } from '@/components/layout/AppShell';
import { ClientDashboardView } from '@/components/dashboard/ClientDashboardView';
import { getClientDashboardSummary, requireClient } from '@/lib/services/portal';

export const dynamic = 'force-dynamic';

export default async function ClientDashboardPage() {
  const user = await requireClient();
  const summary = await getClientDashboardSummary(user.clientRecordId);

  return (
    <AppShell user={user}>
      <ClientDashboardView summary={summary} />
    </AppShell>
  );
}
