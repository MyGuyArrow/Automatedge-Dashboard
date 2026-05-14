import 'server-only';

import type { Asset, AssetCategory, AssetStatus } from '@/types';
import {
  andFormula,
  createRecord,
  fieldEq,
  getRecord,
  listRecords,
  updateRecord,
} from './airtableClient';
import { mapAsset } from './mappers';
import { airtableTables } from './tables';

type AssetFields = Record<string, unknown>;

const now = () => new Date().toISOString();

export type CreateAssetInput = {
  clientRecordId: string;
  uploadedByUserId: string;
  category: AssetCategory;
  fileName: string;
  fileType: string;
  fileSize: number;
  storageKey?: string;
  storageBucket?: string;
  publicUrl?: string;
  description?: string;
  visibleToClient?: boolean;
};

export const getAsset = async (id: string): Promise<Asset> =>
  mapAsset(await getRecord<AssetFields>(airtableTables.assets, id));

export const listAssetsForClientRecord = async (clientRecordId: string) =>
  (await listRecords<AssetFields>(airtableTables.assets, {
    filterByFormula: fieldEq('Client Record ID', clientRecordId),
    sort: [{ field: 'Created At', direction: 'desc' }],
  })).map(mapAsset);

export const listRecentlyUploadedAssets = async (limit = 20) =>
  (await listRecords<AssetFields>(airtableTables.assets, {
    filterByFormula: fieldEq('Status', 'UPLOADED'),
    maxRecords: limit,
    sort: [{ field: 'Created At', direction: 'desc' }],
  })).map(mapAsset);

export const createAssetRecord = async (input: CreateAssetInput): Promise<Asset> => {
  const timestamp = now();
  return mapAsset(
    await createRecord<AssetFields>(airtableTables.assets, {
      'Client Record ID': input.clientRecordId,
      'Uploaded By User ID': input.uploadedByUserId,
      Category: input.category,
      'File Name': input.fileName,
      'File Type': input.fileType,
      'File Size': input.fileSize,
      'Storage Key': input.storageKey || '',
      'Storage Bucket': input.storageBucket || '',
      'Public URL': input.publicUrl,
      Description: input.description,
      Status: 'UPLOADED',
      'Visible To Client': input.visibleToClient ?? true,
      'Created At': timestamp,
      'Updated At': timestamp,
    }),
  );
};

export const updateAssetRecord = async (
  id: string,
  fields: Partial<Pick<Asset, 'description' | 'operatorNotes' | 'visibleToClient' | 'storageKey' | 'storageBucket' | 'publicUrl'>> & {
    category?: AssetCategory;
    status?: AssetStatus;
  },
): Promise<Asset> =>
  mapAsset(
    await updateRecord<AssetFields>(airtableTables.assets, id, {
      ...(fields.category !== undefined ? { Category: fields.category } : {}),
      ...(fields.description !== undefined ? { Description: fields.description } : {}),
      ...(fields.status !== undefined ? { Status: fields.status } : {}),
      ...(fields.operatorNotes !== undefined ? { 'Operator Notes': fields.operatorNotes } : {}),
      ...(fields.visibleToClient !== undefined
        ? { 'Visible To Client': fields.visibleToClient }
        : {}),
      ...(fields.storageKey !== undefined ? { 'Storage Key': fields.storageKey } : {}),
      ...(fields.storageBucket !== undefined ? { 'Storage Bucket': fields.storageBucket } : {}),
      ...(fields.publicUrl !== undefined ? { 'Public URL': fields.publicUrl } : {}),
      'Updated At': now(),
    }),
  );

export const findAssetForClient = async (assetId: string, clientRecordId: string) => {
  const records = await listRecords<AssetFields>(airtableTables.assets, {
    filterByFormula: andFormula(fieldEq('Client Record ID', clientRecordId), `RECORD_ID() = '${assetId}'`),
    maxRecords: 1,
  });
  return records[0] ? mapAsset(records[0]) : undefined;
};
