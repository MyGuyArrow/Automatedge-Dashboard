import 'server-only';

import { z } from 'zod';

import {
  createAccessRequestRecord,
  getAccessRequest,
  listAccessRequestsForClient,
  updateAccessRequestRecord,
} from '@/lib/airtable/accessRequests';
import {
  createAssetRecord,
  getAsset,
  listAssetsForClientRecord,
  listRecentlyUploadedAssets,
  updateAssetRecord,
} from '@/lib/airtable/assets';
import { createAuditLogRecord } from '@/lib/airtable/auditLogs';
import { listAuditScoresForClient } from '@/lib/airtable/auditScores';
import {
  createBuildPhaseRecord,
  getBuildPhase,
  listBuildPhasesForClient,
  updateBuildPhaseRecord,
} from '@/lib/airtable/buildPhases';
import {
  createClientRecord,
  getClient,
  listClients,
  updateClientRecord,
} from '@/lib/airtable/clients';
import {
  getIntakeByClient,
  submitIntake,
  upsertIntakeForClient,
} from '@/lib/airtable/intakes';
import {
  createInternalNoteRecord,
  listInternalNotesForClient,
} from '@/lib/airtable/internalNotes';
import {
  createReportRecord,
  getLatestPublishedReport,
  getReport,
  listReportsForClient,
  listUnpublishedReports,
  updateReportRecord,
} from '@/lib/airtable/reports';
import {
  createTaskRecord,
  getTask,
  listOpenClientVisibleTasks,
  listOverdueTasks,
  listTasksForClient,
  updateTaskRecord,
} from '@/lib/airtable/tasks';
import { createUser, findUserByEmail } from '@/lib/airtable/users';
import { assertAdmin, assertClientAccess, assertInternal, isInternalUser } from '@/lib/authorization';
import {
  defaultAccessRequests,
  defaultBuildPhases,
} from '@/lib/constants';
import {
  CurrentUser,
  getCurrentUser,
  requireAdmin,
  requireAuth,
  requireClient,
  requireOperator,
} from '@/lib/auth/session';
import { hashPassword } from '@/lib/auth/password';
import {
  accessRequestSchema,
  createClientSchema,
  createClientUserSchema,
  intakeDraftSchema,
  presignedUploadSchema,
  recordIdSchema,
  reportSchema,
  taskSchema,
} from '@/lib/validation';
import {
  buildAssetStorageKey,
  createS3PresignedUploadUrl,
  publicUrlForKey,
} from '@/lib/s3/presigned';
import type {
  AccessRequest,
  Asset,
  AssetStatus,
  BuildPhase,
  Client,
  DashboardSummary,
  OperatorSummary,
  Report,
  TaskStatus,
} from '@/types';

export {
  assertClientAccess,
  getCurrentUser,
  requireAdmin,
  requireAuth,
  requireClient,
  requireOperator,
};

const openTaskStatuses = new Set<TaskStatus>(['TODO', 'IN_PROGRESS', 'BLOCKED']);
const clientWritableTaskStatuses = new Set<TaskStatus>(['IN_PROGRESS', 'DONE']);

const requireClientRecord = async (clientRecordId: string) => {
  const client = await getClient(clientRecordId);
  if (!client.id) throw new Error('Client not found.');
  return client;
};

const clientSafeAsset = (asset: Asset, user: CurrentUser) =>
  isInternalUser(user) || asset.visibleToClient || asset.uploadedByUserId === user.id;

export const createAuditLogEntry = async (input: {
  actorUserId?: string;
  clientRecordId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) => createAuditLogRecord(input);

export const createAuditLog = createAuditLogEntry;

export const createBuildPhasesForClient = async (clientRecordId: string) => {
  await requireClientRecord(clientRecordId);
  const created: BuildPhase[] = [];

  for (let index = 0; index < defaultBuildPhases.length; index += 1) {
    const phase = defaultBuildPhases[index];
    created.push(
      await createBuildPhaseRecord({
        clientRecordId,
        phase: phase.phase,
        title: phase.title,
        description: phase.description,
        sortOrder: index + 1,
        visibleToClient: true,
      }),
    );
  }

  return created;
};

export const createClient = async (input: z.infer<typeof createClientSchema>): Promise<Client> => {
  const user = await requireOperator();
  const parsed = createClientSchema.parse(input);
  const client = await createClientRecord(parsed);
  await createBuildPhasesForClient(client.id);
  await createAuditLogEntry({
    actorUserId: user.id,
    clientRecordId: client.id,
    action: 'CLIENT_CREATED',
    entityType: 'Client',
    entityId: client.id,
  });
  return client;
};

export const createClientWorkspace = createClient;

export const createClientUser = async (input: z.infer<typeof createClientUserSchema>) => {
  const user = await requireOperator();
  const parsed = createClientUserSchema.parse(input);
  await requireClientRecord(parsed.clientRecordId);

  const existing = await findUserByEmail(parsed.email);
  if (existing) throw new Error('A user with this email already exists.');

  const created = await createUser({
    email: parsed.email,
    fullName: parsed.fullName,
    passwordHash: await hashPassword(parsed.password),
    role: 'CLIENT',
    clientRecordId: parsed.clientRecordId,
    phone: parsed.phone,
    status: 'INVITED',
  });

  await createAuditLogEntry({
    actorUserId: user.id,
    clientRecordId: parsed.clientRecordId,
    action: 'CLIENT_USER_CREATED',
    entityType: 'User',
    entityId: created.id,
  });

  return created;
};

export const inviteClientUser = createClientUser;

export const getMyClientWorkspace = async () => {
  const user = await requireClient();
  const client = await getClient(user.clientRecordId!);
  const intake = await getIntakeByClient(client.id);
  return { client, intake };
};

export const updateFulfilmentIntakeDraft = async (
  input: z.infer<typeof intakeDraftSchema>,
) => {
  const user = await requireAuth();
  const parsed = intakeDraftSchema.parse(input);
  assertClientAccess(user, parsed.clientRecordId);

  const existing = await getIntakeByClient(parsed.clientRecordId);
  if (existing?.clientConfirmed && !isInternalUser(user)) {
    throw new Error('Confirmed intake cannot be edited by the client. Create a revision request instead.');
  }

  const intake = await upsertIntakeForClient(parsed.clientRecordId, parsed.fields);
  await createAuditLogEntry({
    actorUserId: user.id,
    clientRecordId: parsed.clientRecordId,
    action: 'INTAKE_DRAFT_UPDATED',
    entityType: 'FulfilmentIntake',
    entityId: intake.id,
  });
  return intake;
};

export const submitFulfilmentIntake = async (clientRecordId: string) => {
  const user = await requireAuth();
  const parsedClientId = recordIdSchema.parse(clientRecordId);
  assertClientAccess(user, parsedClientId);

  const intake = await submitIntake(parsedClientId, user.id);
  await updateClientRecord(parsedClientId, { status: 'AWAITING_ASSETS' });
  await createAuditLogEntry({
    actorUserId: user.id,
    clientRecordId: parsedClientId,
    action: 'INTAKE_SUBMITTED',
    entityType: 'FulfilmentIntake',
    entityId: intake.id,
  });
  return intake;
};

export const createAccessRequest = async (input: z.infer<typeof accessRequestSchema>) => {
  const user = await requireOperator();
  const parsed = accessRequestSchema.parse(input);
  await requireClientRecord(parsed.clientRecordId);
  const request = await createAccessRequestRecord({
    ...parsed,
    requestedByUserId: user.id,
  });
  await createAuditLogEntry({
    actorUserId: user.id,
    clientRecordId: parsed.clientRecordId,
    action: 'ACCESS_REQUEST_CREATED',
    entityType: 'AccessRequest',
    entityId: request.id,
  });
  return request;
};

export const createAccessRequestsForClient = async (clientRecordId: string) => {
  const user = await requireOperator();
  const parsedClientId = recordIdSchema.parse(clientRecordId);
  await requireClientRecord(parsedClientId);
  const requests: AccessRequest[] = [];

  for (const item of defaultAccessRequests) {
    requests.push(
      await createAccessRequestRecord({
        clientRecordId: parsedClientId,
        platform: item.platform,
        platformName: item.platformName,
        requestedByUserId: user.id,
        status: 'NOT_REQUESTED',
        required: true,
      }),
    );
  }

  await createAuditLogEntry({
    actorUserId: user.id,
    clientRecordId: parsedClientId,
    action: 'DEFAULT_ACCESS_REQUESTS_CREATED',
    entityType: 'AccessRequest',
    metadata: { count: requests.length },
  });
  return requests;
};

export const updateAccessRequest = async (
  id: string,
  fields: Partial<z.infer<typeof accessRequestSchema>>,
) => {
  const user = await requireAuth();
  const request = await getAccessRequest(recordIdSchema.parse(id));
  assertClientAccess(user, request.clientRecordId);

  const safeClientFields = {
    whoWillProvideAccess: fields.whoWillProvideAccess,
    preferredAccessMethod: fields.preferredAccessMethod,
    accessRestrictions: fields.accessRestrictions,
    targetDate: fields.targetDate,
    clientNotes: fields.clientNotes,
  };

  const updated = await updateAccessRequestRecord(
    request.id,
    isInternalUser(user) ? fields : safeClientFields,
  );
  await createAuditLogEntry({
    actorUserId: user.id,
    clientRecordId: request.clientRecordId,
    action: 'ACCESS_REQUEST_UPDATED',
    entityType: 'AccessRequest',
    entityId: request.id,
  });
  return updated;
};

export const createPresignedUploadUrl = async (
  input: z.infer<typeof presignedUploadSchema>,
) => {
  const user = await requireAuth();
  const parsed = presignedUploadSchema.parse(input);
  assertClientAccess(user, parsed.clientRecordId);

  const asset = await createAssetRecord({
    clientRecordId: parsed.clientRecordId,
    uploadedByUserId: user.id,
    category: parsed.category,
    fileName: parsed.fileName,
    fileType: parsed.fileType,
    fileSize: parsed.fileSize,
    description: parsed.description,
    visibleToClient: true,
  });
  const key = buildAssetStorageKey(parsed.clientRecordId, asset.id, parsed.fileName);
  const upload = await createS3PresignedUploadUrl({
    key,
    fileType: parsed.fileType,
    fileSize: parsed.fileSize,
  });
  const updatedAsset = await updateAssetRecord(asset.id, {
    storageKey: key,
    storageBucket: upload.bucket,
    publicUrl: publicUrlForKey(key),
  });

  await createAuditLogEntry({
    actorUserId: user.id,
    clientRecordId: parsed.clientRecordId,
    action: 'ASSET_UPLOAD_URL_CREATED',
    entityType: 'Asset',
    entityId: asset.id,
  });

  return { asset: updatedAsset, ...upload };
};

export const uploadClientAssetMetadata = createPresignedUploadUrl;

export const listClientAssets = async (clientRecordId: string) => {
  const user = await requireAuth();
  const parsedClientId = recordIdSchema.parse(clientRecordId);
  assertClientAccess(user, parsedClientId);
  const assets = await listAssetsForClientRecord(parsedClientId);
  return assets.filter((asset) => clientSafeAsset(asset, user));
};

export const updateAssetStatus = async (
  assetRecordId: string,
  status: AssetStatus,
  operatorNotes?: string,
) => {
  const user = await requireOperator();
  const asset = await getAsset(recordIdSchema.parse(assetRecordId));
  const updated = await updateAssetRecord(asset.id, { status, operatorNotes });
  await createAuditLogEntry({
    actorUserId: user.id,
    clientRecordId: asset.clientRecordId,
    action: 'ASSET_STATUS_UPDATED',
    entityType: 'Asset',
    entityId: asset.id,
    metadata: { status },
  });
  return updated;
};

export const updateBuildPhase = async (
  phaseRecordId: string,
  fields: Parameters<typeof updateBuildPhaseRecord>[1],
) => {
  const user = await requireOperator();
  const phase = await getBuildPhase(recordIdSchema.parse(phaseRecordId));
  const updated = await updateBuildPhaseRecord(phase.id, fields);
  await createAuditLogEntry({
    actorUserId: user.id,
    clientRecordId: phase.clientRecordId,
    action: 'BUILD_PHASE_UPDATED',
    entityType: 'BuildPhase',
    entityId: phase.id,
  });
  return updated;
};

export const createTask = async (input: z.infer<typeof taskSchema>) => {
  const user = await requireOperator();
  const parsed = taskSchema.parse(input);
  await requireClientRecord(parsed.clientRecordId);
  const task = await createTaskRecord({ ...parsed, createdByUserId: user.id });
  await createAuditLogEntry({
    actorUserId: user.id,
    clientRecordId: parsed.clientRecordId,
    action: 'TASK_CREATED',
    entityType: 'Task',
    entityId: task.id,
  });
  return task;
};

export const createClientTask = createTask;

export const updateTaskStatus = async (taskRecordId: string, status: TaskStatus) => {
  const user = await requireAuth();
  const task = await getTask(recordIdSchema.parse(taskRecordId));
  assertClientAccess(user, task.clientRecordId);

  if (!isInternalUser(user)) {
    if (!task.visibleToClient || task.assignedToType !== 'CLIENT') {
      throw new Error('Client can only update visible client-assigned tasks.');
    }
    if (!clientWritableTaskStatuses.has(status)) {
      throw new Error('Client can only mark tasks as in progress or done.');
    }
  }

  const updated = await updateTaskRecord(task.id, {
    status,
    completedAt: status === 'DONE' ? new Date().toISOString() : undefined,
  });
  await createAuditLogEntry({
    actorUserId: user.id,
    clientRecordId: task.clientRecordId,
    action: 'TASK_STATUS_UPDATED',
    entityType: 'Task',
    entityId: task.id,
    metadata: { status },
  });
  return updated;
};

export const createReportDraft = async (input: z.infer<typeof reportSchema>): Promise<Report> => {
  const user = await requireOperator();
  const parsed = reportSchema.parse(input);
  await requireClientRecord(parsed.clientRecordId);
  const report = await createReportRecord({ ...parsed, status: 'DRAFT', createdByUserId: user.id });
  await createAuditLogEntry({
    actorUserId: user.id,
    clientRecordId: parsed.clientRecordId,
    action: 'REPORT_DRAFT_CREATED',
    entityType: 'Report',
    entityId: report.id,
  });
  return report;
};

export const publishReport = async (reportRecordId: string): Promise<Report> => {
  const user = await requireOperator();
  const report = await getReport(recordIdSchema.parse(reportRecordId));
  const updated = await updateReportRecord(report.id, {
    status: 'PUBLISHED',
    publishedAt: new Date().toISOString(),
  });
  await createAuditLogEntry({
    actorUserId: user.id,
    clientRecordId: report.clientRecordId,
    action: 'REPORT_PUBLISHED',
    entityType: 'Report',
    entityId: report.id,
  });
  return updated;
};

export const getClientDashboardSummary = async (
  clientRecordId?: string,
): Promise<DashboardSummary> => {
  const user = await requireAuth();
  const resolvedClientId = clientRecordId || user.clientRecordId;
  if (!resolvedClientId) throw new Error('Client record ID is required.');
  assertClientAccess(user, resolvedClientId);

  const [client, intake, tasks, buildPhases, latestReport, accessRequests, assets] =
    await Promise.all([
      getClient(resolvedClientId),
      getIntakeByClient(resolvedClientId),
      listOpenClientVisibleTasks(resolvedClientId),
      listBuildPhasesForClient(resolvedClientId),
      getLatestPublishedReport(resolvedClientId),
      listAccessRequestsForClient(resolvedClientId),
      listAssetsForClientRecord(resolvedClientId),
    ]);

  const openAccessRequests = accessRequests.filter(
    (request) =>
      request.required &&
      ['REQUESTED', 'AWAITING_CLIENT', 'FAILED'].includes(request.status),
  );
  const requiredActions = tasks.filter((task) => openTaskStatuses.has(task.status));
  const recentAssets = assets.filter((asset) => clientSafeAsset(asset, user)).slice(0, 8);

  return {
    client,
    intakeStatus: intake?.clientConfirmed ? 'CONFIRMED' : intake ? 'DRAFT' : 'MISSING',
    requiredActions,
    buildPhases: isInternalUser(user)
      ? buildPhases
      : buildPhases.filter((phase) => phase.visibleToClient),
    latestReport,
    openAccessRequests,
    recentAssets,
    dashboardMetrics: latestReport || {},
  };
};

export const getOperatorSummary = async (): Promise<OperatorSummary> => {
  await requireOperator();
  const [clients, overdueTasks, recentlyUploadedAssets, unpublishedReports] = await Promise.all([
    listClients(),
    listOverdueTasks(),
    listRecentlyUploadedAssets(),
    listUnpublishedReports(),
  ]);

  const clientsByStatus = clients.reduce<Record<string, number>>((acc, client) => {
    acc[client.status] = (acc[client.status] || 0) + 1;
    return acc;
  }, {});

  return {
    totalClients: clients.length,
    clientsByStatus,
    clientsAwaitingAssets: clientsByStatus.AWAITING_ASSETS || 0,
    clientsAwaitingAccess: clientsByStatus.AWAITING_ACCESS || 0,
    clientsInBuild: clientsByStatus.IN_BUILD || 0,
    clientsLive: clientsByStatus.LIVE || 0,
    overdueTasks,
    recentlyUploadedAssets,
    unpublishedReports,
  };
};

export const getClientWorkspaceForOperator = async (clientRecordId: string) => {
  await requireOperator();
  const parsedClientId = recordIdSchema.parse(clientRecordId);
  const [
    client,
    intake,
    assets,
    accessRequests,
    buildPhases,
    tasks,
    reports,
    auditScores,
    internalNotes,
  ] =
    await Promise.all([
      getClient(parsedClientId),
      getIntakeByClient(parsedClientId),
      listAssetsForClientRecord(parsedClientId),
      listAccessRequestsForClient(parsedClientId),
      listBuildPhasesForClient(parsedClientId),
      listTasksForClient(parsedClientId),
      listReportsForClient(parsedClientId),
      listAuditScoresForClient(parsedClientId),
      listInternalNotesForClient(parsedClientId),
    ]);

  return {
    client,
    intake,
    assets,
    accessRequests,
    buildPhases,
    tasks,
    reports,
    auditScores,
    internalNotes,
  };
};

export const listOperatorClients = async () => {
  await requireOperator();
  return listClients();
};

export const createInternalNote = async (input: {
  clientRecordId: string;
  note: string;
  category: 'GENERAL' | 'RISK' | 'SALES' | 'TECHNICAL' | 'CLIENT_COMMS' | 'REPORTING' | 'ACCESS' | 'ASSET_REVIEW';
}) => {
  const user = await requireOperator();
  const note = await createInternalNoteRecord({ ...input, createdByUserId: user.id });
  await createAuditLogEntry({
    actorUserId: user.id,
    clientRecordId: input.clientRecordId,
    action: 'INTERNAL_NOTE_CREATED',
    entityType: 'InternalNote',
    entityId: note.id,
  });
  return note;
};

export const createOperatorUser = async (input: {
  email: string;
  fullName: string;
  password: string;
  role: 'OPERATOR' | 'ADMIN';
}) => {
  const user = await requireAdmin();
  assertAdmin(user);
  const existing = await findUserByEmail(input.email);
  if (existing) throw new Error('A user with this email already exists.');
  const created = await createUser({
    email: input.email,
    fullName: input.fullName,
    passwordHash: await hashPassword(input.password),
    role: input.role,
    status: 'ACTIVE',
  });
  await createAuditLogEntry({
    actorUserId: user.id,
    action: 'INTERNAL_USER_CREATED',
    entityType: 'User',
    entityId: created.id,
    metadata: { role: input.role },
  });
  return created;
};

export const listClientReports = async (clientRecordId: string) => {
  const user = await requireAuth();
  const parsedClientId = recordIdSchema.parse(clientRecordId);
  assertClientAccess(user, parsedClientId);
  const reports = await listReportsForClient(parsedClientId, isInternalUser(user) ? undefined : 'PUBLISHED');
  return reports;
};
