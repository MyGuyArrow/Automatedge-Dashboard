import Link from 'next/link';

import { FunnelHealthChart } from '@/components/dashboard/FunnelHealthChart';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { DashboardSummary } from '@/types';

const number = (value?: number) => (value ?? 0).toLocaleString('en-GB');
const money = (value?: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value || 0);
const percent = (value?: number) => `${value ?? 0}%`;

export function ClientDashboardView({ summary }: { summary: DashboardSummary }) {
  const completedPhases = summary.buildPhases.filter((phase) => phase.status === 'COMPLETE').length;
  const progress = summary.buildPhases.length
    ? Math.round((completedPhases / summary.buildPhases.length) * 100)
    : 0;
  const report = summary.latestReport;

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Revenue Engine
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">
              Welcome back, {summary.client.clientName || summary.client.primaryContactName}
            </h2>
            <p className="mt-2 text-slate-600">
              {summary.client.businessName} is currently in the {summary.client.status.replaceAll('_', ' ').toLowerCase()} stage.
            </p>
          </div>
          <StatusBadge status={summary.client.status} />
        </div>
        <div className="mt-6">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Build Status</span>
            <span>{progress}% complete</span>
          </div>
          <div className="mt-2 h-3 rounded-full bg-slate-100">
            <div className="h-3 rounded-full bg-teal-700" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Lead volume" value={number(report?.leadVolume)} />
        <StatCard label="Qualified leads" value={number(report?.qualifiedLeads)} />
        <StatCard label="Booked calls" value={number(report?.bookedCalls)} />
        <StatCard label="Show-ups" value={number(report?.showUps)} />
        <StatCard label="No-shows" value={number(report?.noShows)} />
        <StatCard label="Sales closed" value={number(report?.salesClosed)} />
        <StatCard label="Revenue" value={money(report?.revenue)} />
        <StatCard label="Pipeline value" value={money(report?.pipelineValue)} />
        <StatCard label="Booking rate" value={percent(report?.bookingRate)} />
        <StatCard label="Show-up rate" value={percent(report?.showUpRate)} />
        <StatCard label="Close rate" value={percent(report?.closeRate)} />
        <StatCard label="No-show rate" value={percent(report?.noShowRate)} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">Funnel Health</h3>
          <p className="mt-1 text-sm text-slate-600">
            Manual MVP reporting until external integrations are added.
          </p>
          <div className="mt-5">
            <FunnelHealthChart report={report} />
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950">This Week&apos;s Diagnosis</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {report?.clientSummary || 'No published client summary yet.'}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {report?.bottleneckDiagnosis || 'No bottleneck diagnosis has been published yet.'}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950">What AutomatEdge is doing next</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {report?.nextActions || 'Next actions will appear after the first published report.'}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-slate-950">Required Client Actions</h3>
            <Link href="/client/tasks" className="text-sm font-semibold text-teal-700">
              View tasks
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {summary.requiredActions.length ? (
              summary.requiredActions.map((task) => (
                <div key={task.id} className="rounded-md border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-950">{task.title}</p>
                      {task.description ? (
                        <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                      ) : null}
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600">No open client actions.</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">Access Requirements</h3>
          <div className="mt-5 space-y-3">
            {summary.openAccessRequests.length ? (
              summary.openAccessRequests.map((request) => (
                <div key={request.id} className="rounded-md bg-slate-50 p-3">
                  <p className="font-medium text-slate-900">
                    {request.platformName || request.platform.replaceAll('_', ' ')}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{request.status.replaceAll('_', ' ')}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600">No access items currently blocking progress.</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-950">Build Phase Checklist</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {summary.buildPhases.map((phase) => (
            <div key={phase.id} className="rounded-md border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-slate-950">{phase.title}</p>
                <StatusBadge status={phase.status} />
              </div>
              {phase.blockingReason ? (
                <p className="mt-2 text-sm text-red-700">{phase.blockingReason}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
