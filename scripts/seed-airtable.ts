import fs from 'node:fs';
import path from 'node:path';

import { defaultAccessRequests, defaultBuildPhases } from '../src/lib/constants';

const loadLocalEnv = () => {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
    process.env[key] ||= value;
  }
};

async function createDefaultPhases(clientRecordId: string) {
  const { createBuildPhaseRecord } = await import('../src/lib/airtable/buildPhases');
  for (let index = 0; index < defaultBuildPhases.length; index += 1) {
    const phase = defaultBuildPhases[index];
    await createBuildPhaseRecord({
      clientRecordId,
      phase: phase.phase,
      title: phase.title,
      description: phase.description,
      sortOrder: index + 1,
      visibleToClient: true,
      status: index < 2 ? 'COMPLETE' : index === 2 ? 'IN_PROGRESS' : 'NOT_STARTED',
    });
  }
}

async function main() {
  loadLocalEnv();

  const [
    { createUser, findUserByEmail },
    { hashPassword },
    { createClientRecord },
    { upsertIntakeForClient },
    { createAssetRecord },
    { createAccessRequestRecord },
    { createTaskRecord },
    { createReportRecord },
    { createInternalNoteRecord },
  ] = await Promise.all([
    import('../src/lib/airtable/users'),
    import('../src/lib/auth/password'),
    import('../src/lib/airtable/clients'),
    import('../src/lib/airtable/intakes'),
    import('../src/lib/airtable/assets'),
    import('../src/lib/airtable/accessRequests'),
    import('../src/lib/airtable/tasks'),
    import('../src/lib/airtable/reports'),
    import('../src/lib/airtable/internalNotes'),
  ]);

  const demoPasswordHash = await hashPassword('ChangeMe-Demo-2026!');
  const ensureUser = async (email: string, fullName: string, role: 'ADMIN' | 'OPERATOR' | 'CLIENT', clientRecordId?: string) =>
    (await findUserByEmail(email)) ||
    createUser({
      email,
      fullName,
      role,
      clientRecordId,
      passwordHash: demoPasswordHash,
      status: 'ACTIVE',
    });

  const admin = await ensureUser('admin.demo@automatedge.co.uk', 'Demo Admin', 'ADMIN');
  const operator = await ensureUser('operator.demo@automatedge.co.uk', 'Demo Operator', 'OPERATOR');

  const clientOne = await createClientRecord({
    businessName: 'Northstar Coaching',
    clientName: 'Amelia',
    primaryContactName: 'Amelia Hart',
    primaryContactEmail: 'amelia@example.com',
    website: 'https://example.com',
    niche: 'Creator coaching',
    status: 'IN_BUILD',
    packageType: 'BUILD_MANAGE',
    assignedOperatorUserId: operator.id,
    reportingCadence: 'WEEKLY',
  });
  const clientTwo = await createClientRecord({
    businessName: 'Signal Advisory',
    clientName: 'Marcus',
    primaryContactName: 'Marcus Lee',
    primaryContactEmail: 'marcus@example.com',
    niche: 'Consulting',
    status: 'AWAITING_ACCESS',
    packageType: 'BUILD',
    assignedOperatorUserId: operator.id,
    reportingCadence: 'FORTNIGHTLY',
  });

  const clientUserOne = await ensureUser('client.one@example.com', 'Amelia Hart', 'CLIENT', clientOne.id);
  await ensureUser('client.two@example.com', 'Marcus Lee', 'CLIENT', clientTwo.id);

  await createDefaultPhases(clientOne.id);
  await createDefaultPhases(clientTwo.id);

  await upsertIntakeForClient(clientOne.id, {
    'Current Offer': 'High-ticket creator revenue engine',
    'Offer For': 'Coaches with audience traction',
    'Problem Solved': 'Inconsistent inbound leads and missed follow-up.',
    'Buyer Outcome': 'More qualified calls and clearer pipeline reporting.',
    'Client Confirmed': true,
    'Confirmed At': new Date().toISOString(),
    'Completed By': clientUserOne.id,
  });

  await createAssetRecord({
    clientRecordId: clientOne.id,
    uploadedByUserId: clientUserOne.id,
    category: 'LOGO',
    fileName: 'northstar-logo.png',
    fileType: 'image/png',
    fileSize: 124000,
    storageKey: `client-assets/${clientOne.id}/demo/northstar-logo.png`,
    storageBucket: process.env.S3_BUCKET_NAME || 'demo-bucket',
    description: 'Demo logo metadata only.',
  });

  for (const request of defaultAccessRequests.slice(0, 4)) {
    await createAccessRequestRecord({
      clientRecordId: clientOne.id,
      platform: request.platform,
      platformName: request.platformName,
      status: request.platform === 'DOMAIN_DNS' ? 'AWAITING_CLIENT' : 'REQUESTED',
      requestedByUserId: operator.id,
      required: true,
      instructions: 'Use secure invite, temporary access, screen-share setup, or password manager sharing.',
    });
  }

  await createTaskRecord({
    clientRecordId: clientOne.id,
    title: 'Upload testimonial screenshots',
    description: 'Add proof assets for the landing page and follow-up sequence.',
    assignedToType: 'CLIENT',
    priority: 'HIGH',
    visibleToClient: true,
    createdByUserId: operator.id,
  });

  await createReportRecord({
    clientRecordId: clientOne.id,
    periodStart: '2026-05-01',
    periodEnd: '2026-05-07',
    leadVolume: 86,
    qualifiedLeads: 34,
    bookedCalls: 18,
    showUps: 15,
    noShows: 3,
    salesClosed: 4,
    revenue: 24000,
    pipelineValue: 52000,
    bookingRate: 21,
    showUpRate: 83,
    closeRate: 27,
    noShowRate: 17,
    followUpResponseRate: 31,
    bottleneckDiagnosis: 'Qualified leads are booking, but no-show recovery needs tightening.',
    operatorSummary: 'Booking flow and reminder timing reviewed.',
    clientSummary: 'The strongest leak is no-show recovery after booking.',
    nextActions: 'Tighten reminder copy and add a post-booking confirmation step.',
    status: 'PUBLISHED',
    createdByUserId: operator.id,
  });

  await createReportRecord({
    clientRecordId: clientOne.id,
    periodStart: '2026-05-08',
    periodEnd: '2026-05-14',
    status: 'DRAFT',
    createdByUserId: operator.id,
  });

  await createInternalNoteRecord({
    clientRecordId: clientOne.id,
    category: 'RISK',
    note: 'Demo note: waiting for DNS access before launch QA.',
    createdByUserId: admin.id,
  });

  console.log('Seeded Airtable demo data. Demo password for created users: ChangeMe-Demo-2026!');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
