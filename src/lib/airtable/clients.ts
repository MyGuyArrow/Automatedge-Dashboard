import 'server-only';

import type { Client, ClientStatus, PackageType, ReportingCadence } from '@/types';
import { createRecord, fieldEq, getRecord, listRecords, updateRecord } from './airtableClient';
import { mapClient } from './mappers';
import { airtableTables } from './tables';

type ClientFields = Record<string, unknown>;

const now = () => new Date().toISOString();

export type CreateClientInput = {
  businessName: string;
  clientName?: string;
  primaryContactName: string;
  primaryContactEmail: string;
  phoneWhatsapp?: string;
  website?: string;
  mainSocialProfile?: string;
  otherRelevantLinks?: string;
  niche?: string;
  businessDescription?: string;
  status?: ClientStatus;
  packageType: PackageType;
  assignedOperatorUserId?: string;
  finalApproverName?: string;
  launchTargetDate?: string;
  hardDeadline?: string;
  reportingCadence?: ReportingCadence;
};

export const getClient = async (id: string): Promise<Client> =>
  mapClient(await getRecord<ClientFields>(airtableTables.clients, id));

export const listClients = async () =>
  (await listRecords<ClientFields>(airtableTables.clients, {
    sort: [{ field: 'Updated At', direction: 'desc' }],
  })).map(mapClient);

export const listClientsByStatus = async (status: ClientStatus) =>
  (await listRecords<ClientFields>(airtableTables.clients, {
    filterByFormula: fieldEq('Status', status),
  })).map(mapClient);

export const createClientRecord = async (input: CreateClientInput): Promise<Client> => {
  const timestamp = now();
  const record = await createRecord<ClientFields>(airtableTables.clients, {
    'Business Name': input.businessName,
    'Client Name': input.clientName,
    'Primary Contact Name': input.primaryContactName,
    'Primary Contact Email': input.primaryContactEmail.toLowerCase(),
    'Phone / WhatsApp': input.phoneWhatsapp,
    Website: input.website,
    'Main Social Profile': input.mainSocialProfile,
    'Other Relevant Links': input.otherRelevantLinks,
    Niche: input.niche,
    'Business Description': input.businessDescription,
    Status: input.status || 'INTAKE_PENDING',
    'Package Type': input.packageType,
    'Assigned Operator User ID': input.assignedOperatorUserId,
    'Final Approver Name': input.finalApproverName,
    'Launch Target Date': input.launchTargetDate,
    'Hard Deadline': input.hardDeadline,
    'Reporting Cadence': input.reportingCadence || 'WEEKLY',
    'Created At': timestamp,
    'Updated At': timestamp,
  });
  return mapClient(record);
};

export const updateClientRecord = async (
  id: string,
  fields: Partial<CreateClientInput>,
): Promise<Client> => {
  const record = await updateRecord<ClientFields>(airtableTables.clients, id, {
    ...(fields.businessName !== undefined ? { 'Business Name': fields.businessName } : {}),
    ...(fields.clientName !== undefined ? { 'Client Name': fields.clientName } : {}),
    ...(fields.primaryContactName !== undefined
      ? { 'Primary Contact Name': fields.primaryContactName }
      : {}),
    ...(fields.primaryContactEmail !== undefined
      ? { 'Primary Contact Email': fields.primaryContactEmail.toLowerCase() }
      : {}),
    ...(fields.phoneWhatsapp !== undefined ? { 'Phone / WhatsApp': fields.phoneWhatsapp } : {}),
    ...(fields.website !== undefined ? { Website: fields.website } : {}),
    ...(fields.mainSocialProfile !== undefined
      ? { 'Main Social Profile': fields.mainSocialProfile }
      : {}),
    ...(fields.otherRelevantLinks !== undefined
      ? { 'Other Relevant Links': fields.otherRelevantLinks }
      : {}),
    ...(fields.niche !== undefined ? { Niche: fields.niche } : {}),
    ...(fields.businessDescription !== undefined
      ? { 'Business Description': fields.businessDescription }
      : {}),
    ...(fields.status !== undefined ? { Status: fields.status } : {}),
    ...(fields.packageType !== undefined ? { 'Package Type': fields.packageType } : {}),
    ...(fields.assignedOperatorUserId !== undefined
      ? { 'Assigned Operator User ID': fields.assignedOperatorUserId }
      : {}),
    ...(fields.finalApproverName !== undefined
      ? { 'Final Approver Name': fields.finalApproverName }
      : {}),
    ...(fields.launchTargetDate !== undefined
      ? { 'Launch Target Date': fields.launchTargetDate }
      : {}),
    ...(fields.hardDeadline !== undefined ? { 'Hard Deadline': fields.hardDeadline } : {}),
    ...(fields.reportingCadence !== undefined
      ? { 'Reporting Cadence': fields.reportingCadence }
      : {}),
    'Updated At': now(),
  });
  return mapClient(record);
};
