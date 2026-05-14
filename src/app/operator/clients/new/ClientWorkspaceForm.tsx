'use client';

import { useFormState, useFormStatus } from 'react-dom';

import type { CreateClientFormState } from './page';

type ClientWorkspaceFormProps = {
  action: (state: CreateClientFormState, formData: FormData) => Promise<CreateClientFormState>;
};

const initialState: CreateClientFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {pending ? 'Creating...' : 'Create workspace'}
    </button>
  );
}

export function ClientWorkspaceForm({ action }: ClientWorkspaceFormProps) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="mt-6 grid gap-4 md:grid-cols-2">
      {state.error ? (
        <div className="md:col-span-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}
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
        <SubmitButton />
      </div>
    </form>
  );
}
