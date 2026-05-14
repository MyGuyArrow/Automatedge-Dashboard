import 'server-only';

import type { Report, ReportStatus } from '@/types';
import {
  andFormula,
  createRecord,
  fieldEq,
  getRecord,
  listRecords,
  notFormula,
  updateRecord,
} from './airtableClient';
import { mapReport } from './mappers';
import { airtableTables } from './tables';

type ReportFields = Record<string, unknown>;

const now = () => new Date().toISOString();

export type ReportInput = Partial<
  Pick<
    Report,
    | 'periodStart'
    | 'periodEnd'
    | 'leadVolume'
    | 'qualifiedLeads'
    | 'bookedCalls'
    | 'showUps'
    | 'noShows'
    | 'salesClosed'
    | 'revenue'
    | 'pipelineValue'
    | 'leadSourceBreakdown'
    | 'bookingRate'
    | 'showUpRate'
    | 'closeRate'
    | 'noShowRate'
    | 'followUpResponseRate'
    | 'topPerformingSource'
    | 'bottleneckDiagnosis'
    | 'operatorSummary'
    | 'clientSummary'
    | 'nextActions'
  >
> & {
  clientRecordId: string;
  createdByUserId?: string;
  status?: ReportStatus;
};

const reportFields = (input: Partial<ReportInput>) => ({
  ...(input.periodStart !== undefined ? { 'Period Start': input.periodStart } : {}),
  ...(input.periodEnd !== undefined ? { 'Period End': input.periodEnd } : {}),
  ...(input.leadVolume !== undefined ? { 'Lead Volume': input.leadVolume } : {}),
  ...(input.qualifiedLeads !== undefined ? { 'Qualified Leads': input.qualifiedLeads } : {}),
  ...(input.bookedCalls !== undefined ? { 'Booked Calls': input.bookedCalls } : {}),
  ...(input.showUps !== undefined ? { 'Show Ups': input.showUps } : {}),
  ...(input.noShows !== undefined ? { 'No Shows': input.noShows } : {}),
  ...(input.salesClosed !== undefined ? { 'Sales Closed': input.salesClosed } : {}),
  ...(input.revenue !== undefined ? { Revenue: input.revenue } : {}),
  ...(input.pipelineValue !== undefined ? { 'Pipeline Value': input.pipelineValue } : {}),
  ...(input.leadSourceBreakdown !== undefined
    ? { 'Lead Source Breakdown': input.leadSourceBreakdown }
    : {}),
  ...(input.bookingRate !== undefined ? { 'Booking Rate': input.bookingRate } : {}),
  ...(input.showUpRate !== undefined ? { 'Show Up Rate': input.showUpRate } : {}),
  ...(input.closeRate !== undefined ? { 'Close Rate': input.closeRate } : {}),
  ...(input.noShowRate !== undefined ? { 'No Show Rate': input.noShowRate } : {}),
  ...(input.followUpResponseRate !== undefined
    ? { 'Follow Up Response Rate': input.followUpResponseRate }
    : {}),
  ...(input.topPerformingSource !== undefined
    ? { 'Top Performing Source': input.topPerformingSource }
    : {}),
  ...(input.bottleneckDiagnosis !== undefined
    ? { 'Bottleneck Diagnosis': input.bottleneckDiagnosis }
    : {}),
  ...(input.operatorSummary !== undefined ? { 'Operator Summary': input.operatorSummary } : {}),
  ...(input.clientSummary !== undefined ? { 'Client Summary': input.clientSummary } : {}),
  ...(input.nextActions !== undefined ? { 'Next Actions': input.nextActions } : {}),
});

export const getReport = async (id: string): Promise<Report> =>
  mapReport(await getRecord<ReportFields>(airtableTables.reports, id));

export const listReportsForClient = async (clientRecordId: string, status?: ReportStatus) =>
  (await listRecords<ReportFields>(airtableTables.reports, {
    filterByFormula: status
      ? andFormula(fieldEq('Client Record ID', clientRecordId), fieldEq('Status', status))
      : fieldEq('Client Record ID', clientRecordId),
    sort: [{ field: 'Period End', direction: 'desc' }],
  })).map(mapReport);

export const getLatestPublishedReport = async (clientRecordId: string) => {
  const records = await listRecords<ReportFields>(airtableTables.reports, {
    filterByFormula: andFormula(fieldEq('Client Record ID', clientRecordId), fieldEq('Status', 'PUBLISHED')),
    sort: [{ field: 'Period End', direction: 'desc' }],
    maxRecords: 1,
  });
  return records[0] ? mapReport(records[0]) : undefined;
};

export const listUnpublishedReports = async (limit = 50) =>
  (await listRecords<ReportFields>(airtableTables.reports, {
    filterByFormula: notFormula(fieldEq('Status', 'PUBLISHED')),
    maxRecords: limit,
    sort: [{ field: 'Updated At', direction: 'desc' }],
  })).map(mapReport);

export const createReportRecord = async (input: ReportInput): Promise<Report> => {
  const timestamp = now();
  return mapReport(
    await createRecord<ReportFields>(airtableTables.reports, {
      'Client Record ID': input.clientRecordId,
      ...reportFields(input),
      Status: input.status || 'DRAFT',
      'Created By User ID': input.createdByUserId,
      'Created At': timestamp,
      'Updated At': timestamp,
    }),
  );
};

export const updateReportRecord = async (
  id: string,
  input: Partial<Omit<ReportInput, 'clientRecordId' | 'createdByUserId'>> & {
    publishedAt?: string;
  },
): Promise<Report> =>
  mapReport(
    await updateRecord<ReportFields>(airtableTables.reports, id, {
      ...reportFields(input),
      ...(input.status !== undefined ? { Status: input.status } : {}),
      ...(input.publishedAt !== undefined ? { 'Published At': input.publishedAt } : {}),
      'Updated At': now(),
    }),
  );
