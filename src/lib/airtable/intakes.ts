import 'server-only';

import type { FulfilmentIntake } from '@/types';
import {
  createRecord,
  fieldEq,
  getRecord,
  listRecords,
  updateRecord,
} from './airtableClient';
import { mapIntake } from './mappers';
import { airtableTables } from './tables';

type IntakeFields = Record<string, unknown>;

const now = () => new Date().toISOString();

export const getIntake = async (id: string): Promise<FulfilmentIntake> =>
  mapIntake(await getRecord<IntakeFields>(airtableTables.intakes, id));

export const getIntakeByClient = async (
  clientRecordId: string,
): Promise<FulfilmentIntake | undefined> => {
  const records = await listRecords<IntakeFields>(airtableTables.intakes, {
    filterByFormula: fieldEq('Client Record ID', clientRecordId),
    maxRecords: 1,
  });
  return records[0] ? mapIntake(records[0]) : undefined;
};

export const upsertIntakeForClient = async (
  clientRecordId: string,
  fields: Record<string, unknown>,
): Promise<FulfilmentIntake> => {
  const existing = await getIntakeByClient(clientRecordId);
  const timestamp = now();
  const payload = {
    ...fields,
    'Client Record ID': clientRecordId,
    'Updated At': timestamp,
  };

  if (existing) {
    return mapIntake(await updateRecord<IntakeFields>(airtableTables.intakes, existing.id, payload));
  }

  return mapIntake(
    await createRecord<IntakeFields>(airtableTables.intakes, {
      ...payload,
      'Client Confirmed': false,
      'Created At': timestamp,
    }),
  );
};

export const submitIntake = async (
  clientRecordId: string,
  completedBy: string,
): Promise<FulfilmentIntake> => {
  const existing = await getIntakeByClient(clientRecordId);
  const timestamp = now();

  if (!existing) {
    return mapIntake(
      await createRecord<IntakeFields>(airtableTables.intakes, {
        'Client Record ID': clientRecordId,
        'Client Confirmed': true,
        'Confirmed At': timestamp,
        'Completed By': completedBy,
        'Created At': timestamp,
        'Updated At': timestamp,
      }),
    );
  }

  return mapIntake(
    await updateRecord<IntakeFields>(airtableTables.intakes, existing.id, {
      'Client Confirmed': true,
      'Confirmed At': timestamp,
      'Completed By': completedBy,
      'Updated At': timestamp,
    }),
  );
};
