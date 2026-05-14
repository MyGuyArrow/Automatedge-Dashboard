import { redirect } from 'next/navigation';
import { z } from 'zod';

import { AppShell } from '@/components/layout/AppShell';
import { createClient, requireOperator } from '@/lib/services/portal';
import type { PackageType, ReportingCadence } from '@/types';
import { ClientWorkspaceForm } from './ClientWorkspaceForm';

export const dynamic = 'force-dynamic';

export type CreateClientFormState = {
  error?: string;
};

const requiredFormString = (formData: FormData, key: string) =>
  String(formData.get(key) || '').trim();

const optionalFormString = (formData: FormData, key: string) => {
  const value = requiredFormString(formData, key);
  return value || undefined;
};

async function createClientAction(
  _state: CreateClientFormState,
  formData: FormData,
): Promise<CreateClientFormState> {
  'use server';
  let client;
  try {
    client = await createClient({
      businessName: requiredFormString(formData, 'businessName'),
      clientName: optionalFormString(formData, 'clientName'),
      primaryContactName: requiredFormString(formData, 'primaryContactName'),
      primaryContactEmail: requiredFormString(formData, 'primaryContactEmail'),
      phoneWhatsapp: optionalFormString(formData, 'phoneWhatsapp'),
      website: optionalFormString(formData, 'website'),
      mainSocialProfile: optionalFormString(formData, 'mainSocialProfile'),
      niche: optionalFormString(formData, 'niche'),
      packageType: String(formData.get('packageType') || 'BUILD') as PackageType,
      reportingCadence: String(formData.get('reportingCadence') || 'WEEKLY') as ReportingCadence,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || 'Please check the client details and try again.' };
    }

    return {
      error: error instanceof Error ? error.message : 'Unable to create client workspace.',
    };
  }

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
        <ClientWorkspaceForm action={createClientAction} />
      </section>
    </AppShell>
  );
}
