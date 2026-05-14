import { StatCard } from '@/components/ui/StatCard';
import type { OperatorSummary } from '@/types';

export function OperatorSummaryCards({ summary }: { summary: OperatorSummary }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total clients" value={summary.totalClients} />
      <StatCard label="Awaiting assets" value={summary.clientsAwaitingAssets} />
      <StatCard label="Awaiting access" value={summary.clientsAwaitingAccess} />
      <StatCard label="In build" value={summary.clientsInBuild} />
      <StatCard label="Live clients" value={summary.clientsLive} />
      <StatCard label="Overdue tasks" value={summary.overdueTasks.length} />
      <StatCard label="Uploaded assets" value={summary.recentlyUploadedAssets.length} />
      <StatCard label="Draft reports" value={summary.unpublishedReports.length} />
    </section>
  );
}
