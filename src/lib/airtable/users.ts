import 'server-only';

import type { User, UserRole, UserStatus } from '@/types';
import {
  createRecord,
  escapeFormulaString,
  fieldEq,
  getRecord,
  listRecords,
  updateRecord,
} from './airtableClient';
import { mapUser } from './mappers';
import { airtableTables } from './tables';

type UserFields = Record<string, unknown>;

const now = () => new Date().toISOString();
const emailFormula = (email: string) => `LOWER({Email}) = '${escapeFormulaString(email.toLowerCase())}'`;

export type CreateUserInput = {
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  clientRecordId?: string;
  phone?: string;
  status?: UserStatus;
};

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  const records = await listRecords<UserFields>(airtableTables.users, {
    filterByFormula: emailFormula(email),
    maxRecords: 1,
  });
  return records[0] ? mapUser(records[0]) : undefined;
};

export const getUserById = async (id: string): Promise<User> =>
  mapUser(await getRecord<UserFields>(airtableTables.users, id));

export const listUsers = async () =>
  (await listRecords<UserFields>(airtableTables.users, {
    sort: [{ field: 'Created At', direction: 'desc' }],
  })).map(mapUser);

export const createUser = async (input: CreateUserInput): Promise<User> => {
  const timestamp = now();
  const record = await createRecord<UserFields>(airtableTables.users, {
    Email: input.email.toLowerCase(),
    'Password Hash': input.passwordHash,
    'Full Name': input.fullName,
    Role: input.role,
    'Client Record ID': input.clientRecordId,
    Phone: input.phone,
    Status: input.status || 'ACTIVE',
    'Created At': timestamp,
    'Updated At': timestamp,
  });
  return mapUser(record);
};

export const updateUser = async (
  id: string,
  fields: Partial<Pick<User, 'fullName' | 'role' | 'clientRecordId' | 'phone' | 'status'>> & {
    passwordHash?: string;
  },
): Promise<User> => {
  const record = await updateRecord<UserFields>(airtableTables.users, id, {
    ...(fields.fullName !== undefined ? { 'Full Name': fields.fullName } : {}),
    ...(fields.role !== undefined ? { Role: fields.role } : {}),
    ...(fields.clientRecordId !== undefined ? { 'Client Record ID': fields.clientRecordId } : {}),
    ...(fields.phone !== undefined ? { Phone: fields.phone } : {}),
    ...(fields.status !== undefined ? { Status: fields.status } : {}),
    ...(fields.passwordHash !== undefined ? { 'Password Hash': fields.passwordHash } : {}),
    'Updated At': now(),
  });
  return mapUser(record);
};

export const listUsersForClient = async (clientRecordId: string) =>
  (await listRecords<UserFields>(airtableTables.users, {
    filterByFormula: fieldEq('Client Record ID', clientRecordId),
  })).map(mapUser);
