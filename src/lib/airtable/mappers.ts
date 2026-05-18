import type {
  AccessRequest,
  Asset,
  AuditLog,
  AuditScore,
  BuildPhase,
  Client,
  FulfilmentIntake,
  InternalNote,
  Report,
  Task,
  User,
} from '@/types';
import type { AirtableRecord } from './airtableClient';

const text = (value: unknown) => (typeof value === 'string' ? value : undefined);
const bool = (value: unknown) => value === true;
const num = (value: unknown) => (typeof value === 'number' ? value : undefined);

export const mapUser = (record: AirtableRecord<Record<string, unknown>>): User => ({
  id: record.id,
  email: text(record.fields.Email) || '',
  passwordHash: text(record.fields['Password Hash']),
  fullName: text(record.fields['Full Name']) || '',
  role: (text(record.fields.Role) || 'CLIENT') as User['role'],
  clientRecordId: text(record.fields['Client Record ID']),
  phone: text(record.fields.Phone),
  status: (text(record.fields.Status) || 'INVITED') as User['status'],
  inviteTokenHash: text(record.fields['Invite Token Hash']),
  inviteExpiresAt: text(record.fields['Invite Expires At']),
  inviteSentAt: text(record.fields['Invite Sent At']),
  inviteAcceptedAt: text(record.fields['Invite Accepted At']),
  createdAt: text(record.fields['Created At']) || record.createdTime,
  updatedAt: text(record.fields['Updated At']),
});

export const mapClient = (record: AirtableRecord<Record<string, unknown>>): Client => ({
  id: record.id,
  businessName: text(record.fields['Business Name']) || '',
  clientName: text(record.fields['Client Name']),
  primaryContactName: text(record.fields['Primary Contact Name']) || '',
  primaryContactEmail: text(record.fields['Primary Contact Email']) || '',
  phoneWhatsapp: text(record.fields['Phone / WhatsApp']),
  website: text(record.fields.Website),
  mainSocialProfile: text(record.fields['Main Social Profile']),
  otherRelevantLinks: text(record.fields['Other Relevant Links']),
  niche: text(record.fields.Niche),
  businessDescription: text(record.fields['Business Description']),
  status: (text(record.fields.Status) || 'INTAKE_PENDING') as Client['status'],
  packageType: (text(record.fields['Package Type']) || 'BUILD') as Client['packageType'],
  assignedOperatorUserId: text(record.fields['Assigned Operator User ID']),
  finalApproverName: text(record.fields['Final Approver Name']),
  launchTargetDate: text(record.fields['Launch Target Date']),
  hardDeadline: text(record.fields['Hard Deadline']),
  reportingCadence: text(record.fields['Reporting Cadence']) as Client['reportingCadence'],
  createdAt: text(record.fields['Created At']) || record.createdTime,
  updatedAt: text(record.fields['Updated At']),
});

export const mapIntake = (record: AirtableRecord<Record<string, unknown>>): FulfilmentIntake => ({
  id: record.id,
  clientRecordId: text(record.fields['Client Record ID']) || '',
  fields: record.fields,
  clientConfirmed: bool(record.fields['Client Confirmed']),
  confirmedAt: text(record.fields['Confirmed At']),
  completedBy: text(record.fields['Completed By']),
  createdAt: text(record.fields['Created At']) || record.createdTime,
  updatedAt: text(record.fields['Updated At']),
});

export const mapAsset = (record: AirtableRecord<Record<string, unknown>>): Asset => ({
  id: record.id,
  clientRecordId: text(record.fields['Client Record ID']) || '',
  uploadedByUserId: text(record.fields['Uploaded By User ID']) || '',
  category: (text(record.fields.Category) || 'OTHER') as Asset['category'],
  fileName: text(record.fields['File Name']) || '',
  fileType: text(record.fields['File Type']) || '',
  fileSize: num(record.fields['File Size']) || 0,
  storageKey: text(record.fields['Storage Key']) || '',
  storageBucket: text(record.fields['Storage Bucket']) || '',
  publicUrl: text(record.fields['Public URL']),
  description: text(record.fields.Description),
  status: (text(record.fields.Status) || 'UPLOADED') as Asset['status'],
  operatorNotes: text(record.fields['Operator Notes']),
  visibleToClient: record.fields['Visible To Client'] !== false,
  createdAt: text(record.fields['Created At']) || record.createdTime,
  updatedAt: text(record.fields['Updated At']),
});

export const mapAccessRequest = (
  record: AirtableRecord<Record<string, unknown>>,
): AccessRequest => ({
  id: record.id,
  clientRecordId: text(record.fields['Client Record ID']) || '',
  platform: (text(record.fields.Platform) || 'OTHER') as AccessRequest['platform'],
  platformName: text(record.fields['Platform Name']),
  status: (text(record.fields.Status) || 'REQUESTED') as AccessRequest['status'],
  required: record.fields.Required !== false,
  requestedByUserId: text(record.fields['Requested By User ID']),
  whoWillProvideAccess: text(record.fields['Who Will Provide Access']),
  preferredAccessMethod: text(record.fields['Preferred Access Method']),
  accessRestrictions: text(record.fields['Access Restrictions']),
  targetDate: text(record.fields['Target Date']),
  instructions: text(record.fields.Instructions),
  clientNotes: text(record.fields['Client Notes']),
  operatorNotes: text(record.fields['Operator Notes']),
  createdAt: text(record.fields['Created At']) || record.createdTime,
  updatedAt: text(record.fields['Updated At']),
});

export const mapBuildPhase = (record: AirtableRecord<Record<string, unknown>>): BuildPhase => ({
  id: record.id,
  clientRecordId: text(record.fields['Client Record ID']) || '',
  phase: (text(record.fields.Phase) || 'STRATEGY') as BuildPhase['phase'],
  title: text(record.fields.Title) || '',
  description: text(record.fields.Description),
  status: (text(record.fields.Status) || 'NOT_STARTED') as BuildPhase['status'],
  sortOrder: num(record.fields['Sort Order']) || 0,
  dueDate: text(record.fields['Due Date']),
  completedAt: text(record.fields['Completed At']),
  blockingReason: text(record.fields['Blocking Reason']),
  visibleToClient: record.fields['Visible To Client'] !== false,
  createdAt: text(record.fields['Created At']) || record.createdTime,
  updatedAt: text(record.fields['Updated At']),
});

export const mapTask = (record: AirtableRecord<Record<string, unknown>>): Task => ({
  id: record.id,
  clientRecordId: text(record.fields['Client Record ID']) || '',
  title: text(record.fields.Title) || '',
  description: text(record.fields.Description),
  assignedToType: (text(record.fields['Assigned To Type']) || 'CLIENT') as Task['assignedToType'],
  assignedToUserId: text(record.fields['Assigned To User ID']),
  priority: (text(record.fields.Priority) || 'MEDIUM') as Task['priority'],
  status: (text(record.fields.Status) || 'TODO') as Task['status'],
  dueDate: text(record.fields['Due Date']),
  visibleToClient: record.fields['Visible To Client'] !== false,
  relatedEntityType: text(record.fields['Related Entity Type']),
  relatedEntityId: text(record.fields['Related Entity ID']),
  createdByUserId: text(record.fields['Created By User ID']),
  completedAt: text(record.fields['Completed At']),
  createdAt: text(record.fields['Created At']) || record.createdTime,
  updatedAt: text(record.fields['Updated At']),
});

export const mapReport = (record: AirtableRecord<Record<string, unknown>>): Report => ({
  id: record.id,
  clientRecordId: text(record.fields['Client Record ID']) || '',
  periodStart: text(record.fields['Period Start']) || '',
  periodEnd: text(record.fields['Period End']) || '',
  leadVolume: num(record.fields['Lead Volume']),
  qualifiedLeads: num(record.fields['Qualified Leads']),
  bookedCalls: num(record.fields['Booked Calls']),
  showUps: num(record.fields['Show Ups']),
  noShows: num(record.fields['No Shows']),
  salesClosed: num(record.fields['Sales Closed']),
  revenue: num(record.fields.Revenue),
  pipelineValue: num(record.fields['Pipeline Value']),
  leadSourceBreakdown: text(record.fields['Lead Source Breakdown']),
  bookingRate: num(record.fields['Booking Rate']),
  showUpRate: num(record.fields['Show Up Rate']),
  closeRate: num(record.fields['Close Rate']),
  noShowRate: num(record.fields['No Show Rate']),
  followUpResponseRate: num(record.fields['Follow Up Response Rate']),
  topPerformingSource: text(record.fields['Top Performing Source']),
  bottleneckDiagnosis: text(record.fields['Bottleneck Diagnosis']),
  operatorSummary: text(record.fields['Operator Summary']),
  clientSummary: text(record.fields['Client Summary']),
  nextActions: text(record.fields['Next Actions']),
  status: (text(record.fields.Status) || 'DRAFT') as Report['status'],
  publishedAt: text(record.fields['Published At']),
  createdByUserId: text(record.fields['Created By User ID']),
  createdAt: text(record.fields['Created At']) || record.createdTime,
  updatedAt: text(record.fields['Updated At']),
});

export const mapAuditScore = (record: AirtableRecord<Record<string, unknown>>): AuditScore => ({
  id: record.id,
  ...record.fields,
  clientRecordId: text(record.fields['Client Record ID']) || '',
  totalScore: num(record.fields['Total Score']),
  topRevenueLeaks: text(record.fields['Top Revenue Leaks']),
  operationalRisk: text(record.fields['Operational Risk']),
  commercialImpact: text(record.fields['Commercial Impact']),
  recommendedFix: text(record.fields['Recommended Fix']),
  nextStep: text(record.fields['Next Step']),
  visibleToClient: record.fields['Visible To Client'] === true,
  createdByUserId: text(record.fields['Created By User ID']),
  createdAt: text(record.fields['Created At']) || record.createdTime,
  updatedAt: text(record.fields['Updated At']),
});

export const mapInternalNote = (
  record: AirtableRecord<Record<string, unknown>>,
): InternalNote => ({
  id: record.id,
  clientRecordId: text(record.fields['Client Record ID']) || '',
  note: text(record.fields.Note) || '',
  category: (text(record.fields.Category) || 'GENERAL') as InternalNote['category'],
  createdByUserId: text(record.fields['Created By User ID']),
  createdAt: text(record.fields['Created At']) || record.createdTime,
  updatedAt: text(record.fields['Updated At']),
});

export const mapAuditLog = (record: AirtableRecord<Record<string, unknown>>): AuditLog => ({
  id: record.id,
  actorUserId: text(record.fields['Actor User ID']),
  clientRecordId: text(record.fields['Client Record ID']),
  action: text(record.fields.Action) || '',
  entityType: text(record.fields['Entity Type']) || '',
  entityId: text(record.fields['Entity ID']),
  metadataJson: text(record.fields['Metadata JSON']),
  createdAt: text(record.fields['Created At']) || record.createdTime,
});
