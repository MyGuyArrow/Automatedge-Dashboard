import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { AppShell } from '@/components/layout/AppShell';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ACCESS_SAFETY_WARNING, intakeSections } from '@/lib/constants';
import {
  getMyClientWorkspace,
  requireClient,
  submitFulfilmentIntake,
  updateFulfilmentIntakeDraft,
} from '@/lib/services/portal';

export const dynamic = 'force-dynamic';

const value = (fields: Record<string, unknown> | undefined, key: string) =>
  typeof fields?.[key] === 'string' ? String(fields[key]) : '';

async function saveDraft(formData: FormData) {
  'use server';
  const user = await requireClient();
  await updateFulfilmentIntakeDraft({
    clientRecordId: user.clientRecordId!,
    fields: {
      'Current Offer': formData.get('currentOffer'),
      'Offer For': formData.get('offerFor'),
      'Problem Solved': formData.get('problemSolved'),
      'Buyer Outcome': formData.get('buyerOutcome'),
      'Best Fit Client': formData.get('bestFitClient'),
      'Lead Sources': formData.get('leadSources'),
      'Current CRM': formData.get('currentCrm'),
      'Sales Call Booking Link': formData.get('salesCallBookingLink'),
      'Brand Guidelines': formData.get('brandGuidelines'),
      'Metrics That Matter': formData.get('metricsThatMatter'),
      'Legal Compliance Approval Required': formData.get('legalComplianceApprovalRequired'),
    },
  });
  revalidatePath('/client/intake');
}

async function submitIntakeAction() {
  'use server';
  const user = await requireClient();
  await submitFulfilmentIntake(user.clientRecordId!);
  revalidatePath('/client/dashboard');
  redirect('/client/dashboard');
}

export default async function ClientIntakePage() {
  const user = await requireClient();
  const { client, intake } = await getMyClientWorkspace();
  const locked = intake?.clientConfirmed === true;

  return (
    <AppShell user={user}>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-950">Fulfilment Readiness</h2>
            <StatusBadge status={intake?.clientConfirmed ? 'COMPLETE' : 'INTAKE_PENDING'} />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            This is a fulfilment checklist for {client.businessName}, not a sales onboarding funnel.
          </p>
          <div className="mt-5 space-y-2">
            {intakeSections.map((section) => (
              <div key={section} className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {section}
              </div>
            ))}
          </div>
        </aside>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-950">Client Intake</h1>
          <p className="mt-2 text-sm text-slate-600">{ACCESS_SAFETY_WARNING}</p>
          {locked ? (
            <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              Intake has been confirmed. Ask AutomatEdge to record a revision if something needs changing.
            </div>
          ) : null}
          <form action={saveDraft} className="mt-6 space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Current offer
                <input
                  name="currentOffer"
                  defaultValue={value(intake?.fields, 'Current Offer')}
                  disabled={locked}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Offer for
                <input
                  name="offerFor"
                  defaultValue={value(intake?.fields, 'Offer For')}
                  disabled={locked}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>
            </div>
            <label className="block text-sm font-medium text-slate-700">
              Problem solved
              <textarea
                name="problemSolved"
                defaultValue={value(intake?.fields, 'Problem Solved')}
                disabled={locked}
                rows={3}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Buyer outcome
              <textarea
                name="buyerOutcome"
                defaultValue={value(intake?.fields, 'Buyer Outcome')}
                disabled={locked}
                rows={3}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Best fit client
              <textarea
                name="bestFitClient"
                defaultValue={value(intake?.fields, 'Best Fit Client')}
                disabled={locked}
                rows={3}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Lead sources
                <input
                  name="leadSources"
                  defaultValue={value(intake?.fields, 'Lead Sources')}
                  disabled={locked}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Current CRM
                <input
                  name="currentCrm"
                  defaultValue={value(intake?.fields, 'Current CRM')}
                  disabled={locked}
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>
            </div>
            <label className="block text-sm font-medium text-slate-700">
              Sales call booking link
              <input
                name="salesCallBookingLink"
                defaultValue={value(intake?.fields, 'Sales Call Booking Link')}
                disabled={locked}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Brand guidelines
              <textarea
                name="brandGuidelines"
                defaultValue={value(intake?.fields, 'Brand Guidelines')}
                disabled={locked}
                rows={3}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Metrics that matter
              <input
                name="metricsThatMatter"
                defaultValue={value(intake?.fields, 'Metrics That Matter')}
                disabled={locked}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Legal/compliance approval required
              <input
                name="legalComplianceApprovalRequired"
                defaultValue={value(intake?.fields, 'Legal Compliance Approval Required')}
                disabled={locked}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={locked}
                className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Save draft
              </button>
            </div>
          </form>
          {!locked ? (
            <form action={submitIntakeAction} className="mt-3">
              <button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                Confirm intake
              </button>
            </form>
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}
