import 'server-only';

import type { AccessPlatform, AccessRequest, AccessRequestStatus } from '@/types';
import { createRecord, fieldEq, getRecord, listRecords, updateRecord } from './airtableClient';
import { mapAccessRequest } from './mappers';
import { airtableTables } from './tables';

type AccessFields = Record<string, unknown>;

const now = () => new Date().toISOString();

export type CreateAccessRequestInput = {
  clientRecordId: string;
  platform: AccessPlatform;
  platformName?: string;
  required?: boolean;
  requestedByUserId?: string;
  whoWillProvideAccess?: string;
  preferredAccessMethod?: string;
  accessRestrictions?: string;
  targetDate?: string;
  instructions?: string;
  clientNotes?: string;
  operatorNotes?: string;
  status?: AccessRequestStatus;
};

export const getAccessRequest = async (id: string): Promise<AccessRequest> =>
  mapAccessRequest(await getRecord<AccessFields>(airtableTables.accessRequests, id));

export const listAccessRequestsForClient = async (clientRecordId: string) =>
  (await listRecords<AccessFields>(airtableTables.accessRequests, {
    filterByFormula: fieldEq('Client Record ID', clientRecordId),
    sort: [{ field: 'Created At', direction: 'desc' }],
  })).map(mapAccessRequest);

export const createAccessRequestRecord = async (
  input: CreateAccessRequestInput,
): Promise<AccessRequest> => {
  const timestamp = now();
  return mapAccessRequest(
    await createRecord<AccessFields>(airtableTables.accessRequests, {
      'Client Record ID': input.clientRecordId,
      Platform: input.platform,
      'Platform Name': input.platformName,
      Status: input.status || 'REQUESTED',
      Required: input.required ?? true,
      'Requested By User ID': input.requestedByUserId,
      'Who Will Provide Access': input.whoWillProvideAccess,
      'Preferred Access Method': input.preferredAccessMethod,
      'Access Restrictions': input.accessRestrictions,
      'Target Date': input.targetDate,
      Instructions: input.instructions,
      'Client Notes': input.clientNotes,
      'Operator Notes': input.operatorNotes,
      'Created At': timestamp,
      'Updated At': timestamp,
    }),
  );
};

export const updateAccessRequestRecord = async (
  id: string,
  fields: Partial<Omit<CreateAccessRequestInput, 'clientRecordId' | 'requestedByUserId'>>,
): Promise<AccessRequest> =>
  mapAccessRequest(
    await updateRecord<AccessFields>(airtableTables.accessRequests, id, {
      ...(fields.platform !== undefined ? { Platform: fields.platform } : {}),
      ...(fields.platformName !== undefined ? { 'Platform Name': fields.platformName } : {}),
      ...(fields.status !== undefined ? { Status: fields.status } : {}),
      ...(fields.required !== undefined ? { Required: fields.required } : {}),
      ...(fields.whoWillProvideAccess !== undefined
        ? { 'Who Will Provide Access': fields.whoWillProvideAccess }
        : {}),
      ...(fields.preferredAccessMethod !== undefined
        ? { 'Preferred Access Method': fields.preferredAccessMethod }
        : {}),
      ...(fields.accessRestrictions !== undefined
        ? { 'Access Restrictions': fields.accessRestrictions }
        : {}),
      ...(fields.targetDate !== undefined ? { 'Target Date': fields.targetDate } : {}),
      ...(fields.instructions !== undefined ? { Instructions: fields.instructions } : {}),
      ...(fields.clientNotes !== undefined ? { 'Client Notes': fields.clientNotes } : {}),
      ...(fields.operatorNotes !== undefined ? { 'Operator Notes': fields.operatorNotes } : {}),
      'Updated At': now(),
    }),
  );
