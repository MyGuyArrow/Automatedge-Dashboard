import 'server-only';

import type { BuildPhase, BuildPhaseName, BuildPhaseStatus } from '@/types';
import { createRecord, fieldEq, getRecord, listRecords, updateRecord } from './airtableClient';
import { mapBuildPhase } from './mappers';
import { airtableTables } from './tables';

type BuildPhaseFields = Record<string, unknown>;

const now = () => new Date().toISOString();

export type CreateBuildPhaseInput = {
  clientRecordId: string;
  phase: BuildPhaseName;
  title: string;
  description?: string;
  status?: BuildPhaseStatus;
  sortOrder: number;
  dueDate?: string;
  visibleToClient?: boolean;
};

export const getBuildPhase = async (id: string): Promise<BuildPhase> =>
  mapBuildPhase(await getRecord<BuildPhaseFields>(airtableTables.buildPhases, id));

export const listBuildPhasesForClient = async (clientRecordId: string) =>
  (await listRecords<BuildPhaseFields>(airtableTables.buildPhases, {
    filterByFormula: fieldEq('Client Record ID', clientRecordId),
    sort: [{ field: 'Sort Order', direction: 'asc' }],
  })).map(mapBuildPhase);

export const createBuildPhaseRecord = async (input: CreateBuildPhaseInput): Promise<BuildPhase> => {
  const timestamp = now();
  return mapBuildPhase(
    await createRecord<BuildPhaseFields>(airtableTables.buildPhases, {
      'Client Record ID': input.clientRecordId,
      Phase: input.phase,
      Title: input.title,
      Description: input.description,
      Status: input.status || 'NOT_STARTED',
      'Sort Order': input.sortOrder,
      'Due Date': input.dueDate,
      'Visible To Client': input.visibleToClient ?? true,
      'Created At': timestamp,
      'Updated At': timestamp,
    }),
  );
};

export const updateBuildPhaseRecord = async (
  id: string,
  fields: Partial<Omit<CreateBuildPhaseInput, 'clientRecordId' | 'phase' | 'sortOrder'>> & {
    status?: BuildPhaseStatus;
    completedAt?: string;
    blockingReason?: string;
  },
): Promise<BuildPhase> =>
  mapBuildPhase(
    await updateRecord<BuildPhaseFields>(airtableTables.buildPhases, id, {
      ...(fields.title !== undefined ? { Title: fields.title } : {}),
      ...(fields.description !== undefined ? { Description: fields.description } : {}),
      ...(fields.status !== undefined ? { Status: fields.status } : {}),
      ...(fields.dueDate !== undefined ? { 'Due Date': fields.dueDate } : {}),
      ...(fields.completedAt !== undefined ? { 'Completed At': fields.completedAt } : {}),
      ...(fields.blockingReason !== undefined ? { 'Blocking Reason': fields.blockingReason } : {}),
      ...(fields.visibleToClient !== undefined
        ? { 'Visible To Client': fields.visibleToClient }
        : {}),
      'Updated At': now(),
    }),
  );
