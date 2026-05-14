import 'server-only';

import type { Task, TaskAssigneeType, TaskPriority, TaskStatus } from '@/types';
import {
  andFormula,
  createRecord,
  fieldEq,
  getRecord,
  listRecords,
  notFormula,
  updateRecord,
} from './airtableClient';
import { mapTask } from './mappers';
import { airtableTables } from './tables';

type TaskFields = Record<string, unknown>;

const now = () => new Date().toISOString();

export type CreateTaskInput = {
  clientRecordId: string;
  title: string;
  description?: string;
  assignedToType: TaskAssigneeType;
  assignedToUserId?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  visibleToClient?: boolean;
  relatedEntityType?: string;
  relatedEntityId?: string;
  createdByUserId?: string;
};

export const getTask = async (id: string): Promise<Task> =>
  mapTask(await getRecord<TaskFields>(airtableTables.tasks, id));

export const listTasksForClient = async (clientRecordId: string) =>
  (await listRecords<TaskFields>(airtableTables.tasks, {
    filterByFormula: fieldEq('Client Record ID', clientRecordId),
    sort: [{ field: 'Due Date', direction: 'asc' }],
  })).map(mapTask);

export const listOpenClientVisibleTasks = async (clientRecordId: string) =>
  (await listRecords<TaskFields>(airtableTables.tasks, {
    filterByFormula: andFormula(
      fieldEq('Client Record ID', clientRecordId),
      fieldEq('Visible To Client', true),
      notFormula(fieldEq('Status', 'DONE')),
      notFormula(fieldEq('Status', 'CANCELLED')),
    ),
    sort: [{ field: 'Due Date', direction: 'asc' }],
  })).map(mapTask);

export const listOverdueTasks = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const formula = `AND(IS_BEFORE({Due Date}, '${today}'), NOT({Status} = 'DONE'), NOT({Status} = 'CANCELLED'))`;
  return (await listRecords<TaskFields>(airtableTables.tasks, {
    filterByFormula: formula,
    sort: [{ field: 'Due Date', direction: 'asc' }],
    maxRecords: 50,
  })).map(mapTask);
};

export const createTaskRecord = async (input: CreateTaskInput): Promise<Task> => {
  const timestamp = now();
  return mapTask(
    await createRecord<TaskFields>(airtableTables.tasks, {
      'Client Record ID': input.clientRecordId,
      Title: input.title,
      Description: input.description,
      'Assigned To Type': input.assignedToType,
      'Assigned To User ID': input.assignedToUserId,
      Priority: input.priority || 'MEDIUM',
      Status: input.status || 'TODO',
      'Due Date': input.dueDate,
      'Visible To Client': input.visibleToClient ?? input.assignedToType === 'CLIENT',
      'Related Entity Type': input.relatedEntityType,
      'Related Entity ID': input.relatedEntityId,
      'Created By User ID': input.createdByUserId,
      'Created At': timestamp,
      'Updated At': timestamp,
    }),
  );
};

export const updateTaskRecord = async (
  id: string,
  fields: Partial<Omit<CreateTaskInput, 'clientRecordId' | 'createdByUserId'>> & {
    completedAt?: string;
  },
): Promise<Task> =>
  mapTask(
    await updateRecord<TaskFields>(airtableTables.tasks, id, {
      ...(fields.title !== undefined ? { Title: fields.title } : {}),
      ...(fields.description !== undefined ? { Description: fields.description } : {}),
      ...(fields.assignedToType !== undefined ? { 'Assigned To Type': fields.assignedToType } : {}),
      ...(fields.assignedToUserId !== undefined
        ? { 'Assigned To User ID': fields.assignedToUserId }
        : {}),
      ...(fields.priority !== undefined ? { Priority: fields.priority } : {}),
      ...(fields.status !== undefined ? { Status: fields.status } : {}),
      ...(fields.dueDate !== undefined ? { 'Due Date': fields.dueDate } : {}),
      ...(fields.visibleToClient !== undefined
        ? { 'Visible To Client': fields.visibleToClient }
        : {}),
      ...(fields.relatedEntityType !== undefined
        ? { 'Related Entity Type': fields.relatedEntityType }
        : {}),
      ...(fields.relatedEntityId !== undefined ? { 'Related Entity ID': fields.relatedEntityId } : {}),
      ...(fields.completedAt !== undefined ? { 'Completed At': fields.completedAt } : {}),
      'Updated At': now(),
    }),
  );
