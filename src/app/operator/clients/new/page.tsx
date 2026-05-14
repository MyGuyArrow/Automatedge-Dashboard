import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/AppShell';
import { createClient, requireOperator } from '@/lib/services/portal';
import type { PackageType, ReportingCadence } from '@/types';

export const dynamic = 'force-dynamic';

async function createClientAction(formData: FormData) {
  'use server';
  const client = await createClient({
    businessName: String(formData.get('businessName') || ''),
    clientName: String(formData.get('clientName') || ''),
    primaryContactName: String(formData.get('primaryContactName') || ''),
    primaryContactEmail: String(formData.get('primaryContactEmail') || ''),
    phoneWhatsapp: String(formData.get('phoneWhatsapp') || ''),
    website: String(formData.get('website') || ''),
    mainSocialProfile: String(formData.get('mainSocialProfile') || ''),
    niche: String(formData.get('niche') || ''),
    packageType: String(formData.get('packageType') || 'BUILD') as PackageType,
    reportingCadence: String(formData.get('reportingCadence') || 'WEEKLY') as ReportingCadence,
  });
  redirect(`/operator/clients/${client.id}`);
}

export default async function NewClientPage() {
  const user = await requireOperator();

  return (
    <AppShell user={user}>
      <section className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Create Client Workspace</h1>
        <p className="mt-2 text-sm text-slate-600">
          This creates the Airtable client record and default build phases.
        </p>
        <form action={createClientAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Business name
            <input name="businessName" required className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Client name
            <input name="clientName" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Primary contact
            <input name="primaryContactName" required className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Primary email
            <input name="primaryContactEmail" type="email" required className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Phone / WhatsApp
            <input name="phoneWhatsapp" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Website
            <input name="website" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Main social profile
            <input name="mainSocialProfile" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Niche
            <input name="niche" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Package
            <select name="packageType" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2">
              <option value="BUILD">BUILD</option>
              <option value="BUILD_MANAGE">BUILD_MANAGE</option>
              <option value="PARTNER">PARTNER</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Reporting cadence
            <select name="reportingCadence" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2">
              <option value="WEEKLY">WEEKLY</option>
              <option value="FORTNIGHTLY">FORTNIGHTLY</option>
              <option value="MONTHLY">MONTHLY</option>
            </select>
          </label>
          <div className="md:col-span-2">
            <button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              Create workspace
            </button>
          </div>
        </form>
      </section>
    </AppShell>
  );
}
