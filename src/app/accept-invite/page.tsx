import Link from 'next/link';

import { AcceptInviteForm } from '@/components/auth/AcceptInviteForm';
import { getClientInvitePreview } from '@/lib/services/invites';

export const dynamic = 'force-dynamic';

type AcceptInvitePageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

const tokenFromSearchParams = async (searchParams: AcceptInvitePageProps['searchParams']) => {
  const params = await searchParams;
  return typeof params.token === 'string' ? params.token : undefined;
};

export default async function AcceptInvitePage({ searchParams }: AcceptInvitePageProps) {
  const token = await tokenFromSearchParams(searchParams);
  const preview = token
    ? await getClientInvitePreview(token).catch(() => undefined)
    : undefined;

  if (!token || !preview) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg px-6 py-10 text-fg operational-grid">
        <section className="ae-panel w-full max-w-md p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
            AUTOMATEDGE
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-normal text-fg">
            Invite unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            This invite link is invalid or has expired. Contact AutomatEdge to request a new
            workspace invite.
          </p>
          <Link
            href="/login"
            className="ae-action ae-action-secondary mt-8 w-full px-6 py-3 text-sm font-semibold"
          >
            Back to sign in
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-bg text-fg">
      <section className="hero-stage operational-grid hidden flex-1 border-r border-line bg-fg p-12 text-bg lg:block">
        <div className="relative z-10 flex h-full max-w-xl flex-col justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-bg/70">
              AUTOMATEDGE
            </p>
            <h1 className="mt-6 text-5xl font-extrabold leading-[0.92] tracking-normal">
              Upload
              <br />
              Portal
            </h1>
            <p className="mt-6 max-w-md text-base leading-8 text-bg/60">
              Create your fulfilment workspace account to upload assets and track build progress.
            </p>
          </div>
          <div className="border border-bg/15 bg-bg/5 p-5">
            <p className="text-sm text-bg/70">Workspace</p>
            <p className="mt-2 text-sm text-bg/50">{preview.businessName}</p>
          </div>
        </div>
      </section>
      <section className="flex flex-1 items-center justify-center bg-bg px-6 py-10 operational-grid">
        <div className="ae-panel w-full max-w-md p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
            Client invite
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal text-fg">
            Create your account
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Set a password for {preview.fullName}. This account will open the file upload area for
            {preview.businessName}.
          </p>
          <AcceptInviteForm token={token} email={preview.email} />
        </div>
      </section>
    </main>
  );
}
