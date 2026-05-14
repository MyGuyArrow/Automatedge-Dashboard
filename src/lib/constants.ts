import type { AccessPlatform, AssetCategory, BuildPhaseName } from '@/types';

export const ACCESS_SAFETY_WARNING =
  'Do not send raw passwords. Use secure invites, temporary access, screen-share setup, or password manager sharing.';

export const allowedFileTypes = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'video/quicktime',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const maxUploadBytes = 250 * 1024 * 1024;

export const defaultBuildPhases: Array<{
  phase: BuildPhaseName;
  title: string;
  description: string;
}> = [
  { phase: 'STRATEGY', title: 'Strategy', description: 'Revenue Engine strategy and fulfilment scope.' },
  { phase: 'FUNNEL_MAP', title: 'Funnel Map', description: 'Lead journey, qualification, and conversion flow.' },
  {
    phase: 'LANDING_APPLICATION',
    title: 'Landing/Application',
    description: 'Landing page and application intake assets.',
  },
  { phase: 'CRM_PIPELINE', title: 'CRM Pipeline', description: 'Pipeline stages, tags, and handoff rules.' },
  { phase: 'BOOKING_FLOW', title: 'Booking Flow', description: 'Calendar, reminders, and confirmation flow.' },
  {
    phase: 'FOLLOW_UP_AUTOMATION',
    title: 'Follow-Up Automation',
    description: 'No-show recovery and post-call follow-up.',
  },
  { phase: 'REPORTING_VIEW', title: 'Reporting View', description: 'Manual MVP reporting dashboard.' },
  { phase: 'QA', title: 'QA', description: 'Internal review and client launch readiness check.' },
  { phase: 'LAUNCH', title: 'Launch', description: 'Go-live and initial monitoring.' },
  { phase: 'OPTIMISATION', title: 'Optimisation', description: 'Weekly diagnosis and improvements.' },
];

export const defaultAccessRequests: Array<{ platform: AccessPlatform; platformName: string }> = [
  { platform: 'WEBSITE', platformName: 'Website / landing page platform' },
  { platform: 'DOMAIN_DNS', platformName: 'Domain / DNS' },
  { platform: 'CRM', platformName: 'CRM' },
  { platform: 'EMAIL_MARKETING', platformName: 'Email marketing platform' },
  { platform: 'CALENDAR_BOOKING', platformName: 'Calendar / booking tool' },
  { platform: 'FORM_TOOL', platformName: 'Form tool' },
  { platform: 'AUTOMATION_TOOL', platformName: 'Automation tool' },
  { platform: 'ANALYTICS_TRACKING', platformName: 'Analytics / tracking' },
  { platform: 'PAYMENT_PLATFORM', platformName: 'Payment platform' },
  { platform: 'SMS_WHATSAPP', platformName: 'SMS / WhatsApp tool' },
  { platform: 'SOCIAL_MEDIA', platformName: 'Social media account' },
  { platform: 'BRAND_FOLDER', platformName: 'Brand asset folder' },
  { platform: 'OTHER', platformName: 'Other' },
];

export const defaultAssetChecklist: Array<{ category: AssetCategory; label: string }> = [
  { category: 'LOGO', label: 'Logo files' },
  { category: 'BRAND_GUIDELINES', label: 'Brand guidelines' },
  { category: 'BRAND_GUIDELINES', label: 'Brand colours/fonts notes' },
  { category: 'IMAGE', label: 'Image assets' },
  { category: 'VIDEO', label: 'Video assets' },
  { category: 'TESTIMONIAL', label: 'Testimonials/proof assets' },
  { category: 'CASE_STUDY', label: 'Case studies/client results' },
  { category: 'OFFER_COPY', label: 'Offer copy' },
  { category: 'SALES_PAGE_COPY', label: 'Sales page or previous landing page copy' },
  { category: 'CONTENT_EXAMPLE', label: 'Content examples' },
  { category: 'EMAIL_SMS_COPY', label: 'Email/SMS copy' },
  { category: 'OTHER', label: 'Other files' },
];

export const intakeSections = [
  'Client Details',
  'Business and Offer',
  'Ideal Client Profile',
  'Current Funnel and Lead Flow',
  'Sales Process and Metrics',
  'CRM and Tool Stack',
  'Access Requirements',
  'Booking Flow',
  'Follow-Up and Nurture',
  'Brand, Content, and Assets',
  'Tracking, Reporting, and Launch',
  'Client Responsibilities and Confirmation',
] as const;
