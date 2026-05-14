import 'server-only';

import type { InternalNote, InternalNoteCategory } from '@/types';
import { createRecord, fieldEq, getRecord, listRecords } from './airtableClient';
import { mapInternalNote } from './mappers';
import { airtableTables } from './tables';

type NoteFields = Record<string, unknown>;

const now = () => new Date().toISOString();

export const getInternalNote = async (id: string): Promise<InternalNote> =>
  mapInternalNote(await getRecord<NoteFields>(airtableTables.internalNotes, id));

export const listInternalNotesForClient = async (clientRecordId: string) =>
  (await listRecords<NoteFields>(airtableTables.internalNotes, {
    filterByFormula: fieldEq('Client Record ID', clientRecordId),
    sort: [{ field: 'Created At', direction: 'desc' }],
  })).map(mapInternalNote);

export const createInternalNoteRecord = async (input: {
  clientRecordId: string;
  note: string;
  category: InternalNoteCategory;
  createdByUserId: string;
}): Promise<InternalNote> => {
  const timestamp = now();
  return mapInternalNote(
    await createRecord<NoteFields>(airtableTables.internalNotes, {
      'Client Record ID': input.clientRecordId,
      Note: input.note,
      Category: input.category,
      'Created By User ID': input.createdByUserId,
      'Created At': timestamp,
      'Updated At': timestamp,
    }),
  );
};
