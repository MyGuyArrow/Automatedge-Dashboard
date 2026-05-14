import 'server-only';

import type { AuditScore } from '@/types';
import { createRecord, fieldEq, getRecord, listRecords, updateRecord } from './airtableClient';
import { mapAuditScore } from './mappers';
import { airtableTables } from './tables';

type AuditScoreFields = Record<string, unknown>;

const now = () => new Date().toISOString();

export const getAuditScore = async (id: string): Promise<AuditScore> =>
  mapAuditScore(await getRecord<AuditScoreFields>(airtableTables.auditScores, id));

export const listAuditScoresForClient = async (clientRecordId: string) =>
  (await listRecords<AuditScoreFields>(airtableTables.auditScores, {
    filterByFormula: fieldEq('Client Record ID', clientRecordId),
    sort: [{ field: 'Created At', direction: 'desc' }],
  })).map(mapAuditScore);

export const createAuditScoreRecord = async (
  fields: Record<string, unknown> & { clientRecordId: string; createdByUserId?: string },
): Promise<AuditScore> => {
  const timestamp = now();
  return mapAuditScore(
    await createRecord<AuditScoreFields>(airtableTables.auditScores, {
      ...fields,
      'Client Record ID': fields.clientRecordId,
      'Created By User ID': fields.createdByUserId,
      'Created At': timestamp,
      'Updated At': timestamp,
    }),
  );
};

export const updateAuditScoreRecord = async (
  id: string,
  fields: Record<string, unknown>,
): Promise<AuditScore> =>
  mapAuditScore(
    await updateRecord<AuditScoreFields>(airtableTables.auditScores, id, {
      ...fields,
      'Updated At': now(),
    }),
  );
