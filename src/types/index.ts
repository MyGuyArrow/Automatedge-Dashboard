export type UserRole = 'CLIENT' | 'OPERATOR' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INVITED' | 'DISABLED';
export type ClientStatus =
  | 'INTAKE_PENDING'
  | 'AWAITING_ASSETS'
  | 'AWAITING_ACCESS'
  | 'IN_BUILD'
  | 'QA_REVIEW'
  | 'LIVE'
  | 'PAUSED'
  | 'COMPLETE';
export type PackageType = 'BUILD' | 'BUILD_MANAGE' | 'PARTNER';
export type ReportingCadence = 'WEEKLY' | 'FORTNIGHTLY' | 'MONTHLY';
export type AssetCategory =
  | 'LOGO'
  | 'BRAND_GUIDELINES'
  | 'IMAGE'
  | 'VIDEO'
  | 'TESTIMONIAL'
  | 'CASE_STUDY'
  | 'OFFER_COPY'
  | 'SALES_PAGE_COPY'
  | 'CONTENT_EXAMPLE'
  | 'EMAIL_SMS_COPY'
  | 'OTHER';
export type AssetStatus = 'UPLOADED' | 'REVIEWED' | 'APPROVED' | 'REJECTED' | 'NEEDS_REPLACEMENT';
export type AccessPlatform =
  | 'WEBSITE'
  | 'DOMAIN_DNS'
  | 'CRM'
  | 'EMAIL_MARKETING'
  | 'CALENDAR_BOOKING'
  | 'FORM_TOOL'
  | 'AUTOMATION_TOOL'
  | 'ANALYTICS_TRACKING'
  | 'PAYMENT_PLATFORM'
  | 'SMS_WHATSAPP'
  | 'SOCIAL_MEDIA'
  | 'BRAND_FOLDER'
  | 'OTHER';
export type AccessRequestStatus =
  | 'NOT_REQUESTED'
  | 'REQUESTED'
  | 'AWAITING_CLIENT'
  | 'RECEIVED'
  | 'CONNECTED'
  | 'FAILED'
  | 'NOT_NEEDED';
export type BuildPhaseName =
  | 'STRATEGY'
  | 'FUNNEL_MAP'
  | 'LANDING_APPLICATION'
  | 'CRM_PIPELINE'
  | 'BOOKING_FLOW'
  | 'FOLLOW_UP_AUTOMATION'
  | 'REPORTING_VIEW'
  | 'QA'
  | 'LAUNCH'
  | 'OPTIMISATION';
export type BuildPhaseStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'AWAITING_CLIENT'
  | 'IN_REVIEW'
  | 'COMPLETE';
export type TaskAssigneeType = 'CLIENT' | 'OPERATOR' | 'ADMIN';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE' | 'CANCELLED';
export type ReportStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type InternalNoteCategory =
  | 'GENERAL'
  | 'RISK'
  | 'SALES'
  | 'TECHNICAL'
  | 'CLIENT_COMMS'
  | 'REPORTING'
  | 'ACCESS'
  | 'ASSET_REVIEW';

export type User = {
  id: string;
  email: string;
  passwordHash?: string;
  fullName: string;
  role: UserRole;
  clientRecordId?: string;
  phone?: string;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type Client = {
  id: string;
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
  status: ClientStatus;
  packageType: PackageType;
  assignedOperatorUserId?: string;
  finalApproverName?: string;
  launchTargetDate?: string;
  hardDeadline?: string;
  reportingCadence?: ReportingCadence;
  createdAt?: string;
  updatedAt?: string;
};

export type FulfilmentIntake = {
  id: string;
  clientRecordId: string;
  fields: Record<string, unknown>;
  clientConfirmed?: boolean;
  confirmedAt?: string;
  completedBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Asset = {
  id: string;
  clientRecordId: string;
  uploadedByUserId: string;
  category: AssetCategory;
  fileName: string;
  fileType: string;
  fileSize: number;
  storageKey: string;
  storageBucket: string;
  publicUrl?: string;
  description?: string;
  status: AssetStatus;
  operatorNotes?: string;
  visibleToClient: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AccessRequest = {
  id: string;
  clientRecordId: string;
  platform: AccessPlatform;
  platformName?: string;
  status: AccessRequestStatus;
  required: boolean;
  requestedByUserId?: string;
  whoWillProvideAccess?: string;
  preferredAccessMethod?: string;
  accessRestrictions?: string;
  targetDate?: string;
  instructions?: string;
  clientNotes?: string;
  operatorNotes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type BuildPhase = {
  id: string;
  clientRecordId: string;
  phase: BuildPhaseName;
  title: string;
  description?: string;
  status: BuildPhaseStatus;
  sortOrder: number;
  dueDate?: string;
  completedAt?: string;
  blockingReason?: string;
  visibleToClient: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Task = {
  id: string;
  clientRecordId: string;
  title: string;
  description?: string;
  assignedToType: TaskAssigneeType;
  assignedToUserId?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  visibleToClient: boolean;
  relatedEntityType?: string;
  relatedEntityId?: string;
  createdByUserId?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Report = {
  id: string;
  clientRecordId: string;
  periodStart: string;
  periodEnd: string;
  leadVolume?: number;
  qualifiedLeads?: number;
  bookedCalls?: number;
  showUps?: number;
  noShows?: number;
  salesClosed?: number;
  revenue?: number;
  pipelineValue?: number;
  leadSourceBreakdown?: string;
  bookingRate?: number;
  showUpRate?: number;
  closeRate?: number;
  noShowRate?: number;
  followUpResponseRate?: number;
  topPerformingSource?: string;
  bottleneckDiagnosis?: string;
  operatorSummary?: string;
  clientSummary?: string;
  nextActions?: string;
  status: ReportStatus;
  publishedAt?: string;
  createdByUserId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuditScore = {
  id: string;
  clientRecordId: string;
  totalScore?: number;
  topRevenueLeaks?: string;
  operationalRisk?: string;
  commercialImpact?: string;
  recommendedFix?: string;
  nextStep?: string;
  visibleToClient: boolean;
  createdByUserId?: string;
  createdAt?: string;
  updatedAt?: string;
  [score: string]: unknown;
};

export type InternalNote = {
  id: string;
  clientRecordId: string;
  note: string;
  category: InternalNoteCategory;
  createdByUserId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuditLog = {
  id: string;
  actorUserId?: string;
  clientRecordId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadataJson?: string;
  createdAt?: string;
};

export type DashboardSummary = {
  client: Client;
  intakeStatus: 'DRAFT' | 'CONFIRMED' | 'MISSING';
  requiredActions: Task[];
  buildPhases: BuildPhase[];
  latestReport?: Report;
  openAccessRequests: AccessRequest[];
  recentAssets: Asset[];
  dashboardMetrics: Partial<Report>;
};

export type OperatorSummary = {
  totalClients: number;
  clientsByStatus: Record<string, number>;
  clientsAwaitingAssets: number;
  clientsAwaitingAccess: number;
  clientsInBuild: number;
  clientsLive: number;
  overdueTasks: Task[];
  recentlyUploadedAssets: Asset[];
  unpublishedReports: Report[];
};
