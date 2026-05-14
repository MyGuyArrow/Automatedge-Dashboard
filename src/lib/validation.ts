import { z } from 'zod';

import { allowedFileTypes, maxUploadBytes } from './constants';

export const recordIdSchema = z.string().min(3);

export const createClientSchema = z.object({
  businessName: z.string().min(1),
  clientName: z.string().optional(),
  primaryContactName: z.string().min(1),
  primaryContactEmail: z.string().email(),
  phoneWhatsapp: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  mainSocialProfile: z.string().optional(),
  otherRelevantLinks: z.string().optional(),
  niche: z.string().optional(),
  businessDescription: z.string().optional(),
  packageType: z.enum(['BUILD', 'BUILD_MANAGE', 'PARTNER']),
  assignedOperatorUserId: z.string().optional(),
  finalApproverName: z.string().optional(),
  launchTargetDate: z.string().optional(),
  hardDeadline: z.string().optional(),
  reportingCadence: z.enum(['WEEKLY', 'FORTNIGHTLY', 'MONTHLY']).optional(),
});

export const createClientUserSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1),
  password: z.string().min(12),
  clientRecordId: recordIdSchema,
  phone: z.string().optional(),
});

export const intakeDraftSchema = z.object({
  clientRecordId: recordIdSchema,
  fields: z.record(z.unknown()),
});

export const accessRequestSchema = z.object({
  clientRecordId: recordIdSchema,
  platform: z.enum([
    'WEBSITE',
    'DOMAIN_DNS',
    'CRM',
    'EMAIL_MARKETING',
    'CALENDAR_BOOKING',
    'FORM_TOOL',
    'AUTOMATION_TOOL',
    'ANALYTICS_TRACKING',
    'PAYMENT_PLATFORM',
    'SMS_WHATSAPP',
    'SOCIAL_MEDIA',
    'BRAND_FOLDER',
    'OTHER',
  ]),
  platformName: z.string().optional(),
  required: z.boolean().optional(),
  whoWillProvideAccess: z.string().optional(),
  preferredAccessMethod: z.string().optional(),
  accessRestrictions: z.string().optional(),
  targetDate: z.string().optional(),
  instructions: z.string().optional(),
  clientNotes: z.string().optional(),
  operatorNotes: z.string().optional(),
  status: z
    .enum(['NOT_REQUESTED', 'REQUESTED', 'AWAITING_CLIENT', 'RECEIVED', 'CONNECTED', 'FAILED', 'NOT_NEEDED'])
    .optional(),
});

export const presignedUploadSchema = z.object({
  clientRecordId: recordIdSchema,
  category: z.enum([
    'LOGO',
    'BRAND_GUIDELINES',
    'IMAGE',
    'VIDEO',
    'TESTIMONIAL',
    'CASE_STUDY',
    'OFFER_COPY',
    'SALES_PAGE_COPY',
    'CONTENT_EXAMPLE',
    'EMAIL_SMS_COPY',
    'OTHER',
  ]),
  fileName: z.string().min(1).max(180),
  fileType: z.enum(allowedFileTypes),
  fileSize: z.number().int().positive().max(maxUploadBytes),
  description: z.string().optional(),
});

export const taskSchema = z.object({
  clientRecordId: recordIdSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  assignedToType: z.enum(['CLIENT', 'OPERATOR', 'ADMIN']),
  assignedToUserId: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueDate: z.string().optional(),
  visibleToClient: z.boolean().optional(),
  relatedEntityType: z.string().optional(),
  relatedEntityId: z.string().optional(),
});

export const reportSchema = z.object({
  clientRecordId: recordIdSchema,
  periodStart: z.string().min(1),
  periodEnd: z.string().min(1),
  leadVolume: z.number().optional(),
  qualifiedLeads: z.number().optional(),
  bookedCalls: z.number().optional(),
  showUps: z.number().optional(),
  noShows: z.number().optional(),
  salesClosed: z.number().optional(),
  revenue: z.number().optional(),
  pipelineValue: z.number().optional(),
  leadSourceBreakdown: z.string().optional(),
  bookingRate: z.number().optional(),
  showUpRate: z.number().optional(),
  closeRate: z.number().optional(),
  noShowRate: z.number().optional(),
  followUpResponseRate: z.number().optional(),
  topPerformingSource: z.string().optional(),
  bottleneckDiagnosis: z.string().optional(),
  operatorSummary: z.string().optional(),
  clientSummary: z.string().optional(),
  nextActions: z.string().optional(),
});
