import 'server-only';

import type { AuditLog } from '@/types';
import { createRecord, fieldEq, listRecords } from './airtableClient';
import { mapAuditLog } from './mappers';
import { airtableTables } from './tables';

type AuditLogFields = Record<string, unknown>;

export type AuditLogInput = {
  actorUserId?: string;
  clientRecordId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
};

export const createAuditLogRecord = async (input: AuditLogInput): Promise<AuditLog> =>
  mapAuditLog(
    await createRecord<AuditLogFields>(airtableTables.auditLogs, {
      'Actor User ID': input.actorUserId,
      'Client Record ID': input.clientRecordId,
      Action: input.action,
      'Entity Type': input.entityType,
      'Entity ID': input.entityId,
      'Metadata JSON': input.metadata ? JSON.stringify(input.metadata) : undefined,
      'Created At': new Date().toISOString(),
    }),
  );

export const listAuditLogsForClient = async (clientRecordId: string) =>
  (await listRecords<AuditLogFields>(airtableTables.auditLogs, {
    filterByFormula: fieldEq('Client Record ID', clientRecordId),
    sort: [{ field: 'Created At', direction: 'desc' }],
  })).map(mapAuditLog);
