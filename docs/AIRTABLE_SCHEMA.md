# Airtable Schema

Create one Airtable base for the AutomatEdge Fulfilment Dashboard. Field names must match exactly because the service layer maps by field name. Use single select fields for enum values, checkbox fields for booleans, number/currency fields for metrics, and long text fields for operational notes.

## Users

| Field | Type | Example |
| --- | --- | --- |
| Email | Email or single line text | client@example.com |
| Password Hash | Single line text | `$2a$12$...` |
| Full Name | Single line text | Amelia Hart |
| Role | Single select: CLIENT, OPERATOR, ADMIN | CLIENT |
| Client Record ID | Single line text | recXXXXXXXXXXXXXX |
| Phone | Single line text | +44 7000 000000 |
| Status | Single select: ACTIVE, INVITED, DISABLED | ACTIVE |
| Created At | Date/time or single line text | 2026-05-14T10:00:00.000Z |
| Updated At | Date/time or single line text | 2026-05-14T10:00:00.000Z |

CLIENT users must have `Client Record ID`. Operators and admins leave it blank.

## Clients

| Field | Type | Example |
| --- | --- | --- |
| Business Name | Single line text | Northstar Coaching |
| Client Name | Single line text | Amelia |
| Primary Contact Name | Single line text | Amelia Hart |
| Primary Contact Email | Email or single line text | amelia@example.com |
| Phone / WhatsApp | Single line text | +44 7000 000000 |
| Website | URL | https://example.com |
| Main Social Profile | URL or single line text | https://instagram.com/example |
| Other Relevant Links | Long text | YouTube, podcast, sales page |
| Niche | Single line text | Creator coaching |
| Business Description | Long text | High-ticket coaching offer |
| Status | Single select: INTAKE_PENDING, AWAITING_ASSETS, AWAITING_ACCESS, IN_BUILD, QA_REVIEW, LIVE, PAUSED, COMPLETE | IN_BUILD |
| Package Type | Single select: BUILD, BUILD_MANAGE, PARTNER | BUILD_MANAGE |
| Assigned Operator User ID | Single line text | recOperatorUser |
| Final Approver Name | Single line text | Amelia Hart |
| Launch Target Date | Date | 2026-06-01 |
| Hard Deadline | Date | 2026-06-10 |
| Reporting Cadence | Single select: WEEKLY, FORTNIGHTLY, MONTHLY | WEEKLY |
| Created At | Date/time or single line text | 2026-05-14T10:00:00.000Z |
| Updated At | Date/time or single line text | 2026-05-14T10:00:00.000Z |

## Fulfilment Intakes

| Field | Type | Example |
| --- | --- | --- |
| Client Record ID | Single line text | recClient |
| Current Offer | Long text | Revenue Engine implementation |
| Offer For | Long text | Coaches and experts |
| Problem Solved | Long text | Inconsistent leads and follow-up |
| Buyer Outcome | Long text | More booked qualified calls |
| Price Point | Single line text | £5,000 |
| Qualified Client Value | Number or currency | 5000 |
| Offer Delivery Type | Single select: ONE_TO_ONE, GROUP, CONSULTING, DONE_FOR_YOU, COURSE, COMMUNITY, OTHER | CONSULTING |
| Offer Selling Status | Single select: YES, NO, VALIDATION | YES |
| Monthly Client Capacity | Number | 12 |
| Belief Before Booking | Long text | They need proof and clear next steps |
| Best Fit Client | Long text | Established expert with audience |
| Current Situation | Long text | Leads arrive from content |
| Pain Frustration | Long text | Missed responses and no-shows |
| Desired Result | Long text | Predictable call flow |
| Bad Fit Description | Long text | Early-stage without offer validation |
| Qualification Criteria | Long text | Revenue, urgency, fit |
| Excluded Industries Or People | Long text | Restricted niches |
| Lead Sources | Long text | Instagram, LinkedIn, referrals |
| Main CTA | Single line text | Book a call |
| Link In Bio Destination | URL or single line text | https://example.com/apply |
| What Happens When Interested | Long text | DM then manual booking |
| Current Lead Destination | Long text | DM inbox, spreadsheet |
| Manual Or Inconsistent Parts | Long text | Follow-up and lead tagging |
| Suspected Leakage | Long text | Application to booking |
| Inbound Leads Per Month | Number | 80 |
| Booked Calls Per Month | Number | 18 |
| Show Up Rate | Number | 80 |
| Close Rate | Number | 25 |
| Buying Objections | Long text | Price and timing |
| Post Call No Buy Process | Long text | Manual follow-up |
| Sends Proposals | Single select: YES, NO, SOMETIMES | SOMETIMES |
| Proposal Storage Location | Single line text | Google Drive |
| Sales Call Booking Link | URL or single line text | https://cal.com/example |
| Current CRM | Single line text | HubSpot |
| Current Email Marketing Tool | Single line text | ConvertKit |
| Current Calendar Tool | Single line text | Calendly |
| Current Website Platform | Single line text | Webflow |
| Current Form Tool | Single line text | Typeform |
| Current Payment Tool | Single line text | Stripe |
| Current SMS WhatsApp Tool | Single line text | WhatsApp Business |
| Current Automation Tool | Single line text | Make |
| Tools Used | Long text | HubSpot, Calendly, Stripe |
| Stack Preference | Single select: USE_EXISTING, RECOMMEND_BEST, NOT_SURE | USE_EXISTING |
| Call Type | Single line text | Strategy call |
| Call Duration | Single line text | 45 minutes |
| Available Call Times | Long text | Tue-Thu afternoons |
| Calendar Owner | Single line text | Amelia |
| Application Before Booking | Single select: YES, NO, NOT_SURE | YES |
| Disqualification Rules | Long text | Low budget, no offer |
| Booking Confirmation Message | Long text | Confirmation copy |
| Pre Call Instructions | Long text | Watch prep video |
| Reminder Channels | Long text | Email, SMS |
| Reminder Timings | Long text | 24h, 2h |
| New Lead Submission Action | Long text | Create CRM lead |
| Unbooked Lead Action | Long text | Follow-up sequence |
| No Show Action | Long text | Recovery reminders |
| Post Call No Buy Follow Up | Long text | 14-day sequence |
| Has Existing Email SMS Copy | Single select: YES, NO, SOME | SOME |
| Preferred Follow Up Tone | Long text | Direct, helpful |
| Words Claims Angles To Avoid | Long text | Income guarantees |
| Brand Guidelines | Long text | Link or notes |
| Brand Colours | Single line text | #0f766e |
| Fonts | Single line text | Inter |
| Proof Assets Permission Notes | Long text | Approved screenshots only |
| Compliance Restrictions | Long text | No guaranteed outcomes |
| Metrics That Matter | Long text | Leads, calls, show-ups, revenue |
| Preferred Reporting Location | Single line text | Portal |
| Reporting Recipients | Long text | Founder and ops |
| Campaigns Launches Events | Long text | June webinar |
| Must Be Ready Before Launch | Long text | DNS, calendar, offer copy |
| Final Launch Approver | Single line text | Amelia Hart |
| Legal Compliance Approval Required | Single line text or checkbox | Yes |
| Client Confirmed | Checkbox | checked |
| Confirmed At | Date/time or single line text | 2026-05-14T10:00:00.000Z |
| Completed By | Single line text | recUser |
| Created At | Date/time or single line text | 2026-05-14T10:00:00.000Z |
| Updated At | Date/time or single line text | 2026-05-14T10:00:00.000Z |

## Assets

| Field | Type | Example |
| --- | --- | --- |
| Client Record ID | Single line text | recClient |
| Uploaded By User ID | Single line text | recUser |
| Category | Single select: LOGO, BRAND_GUIDELINES, IMAGE, VIDEO, TESTIMONIAL, CASE_STUDY, OFFER_COPY, SALES_PAGE_COPY, CONTENT_EXAMPLE, EMAIL_SMS_COPY, OTHER | LOGO |
| File Name | Single line text | logo.png |
| File Type | Single line text | image/png |
| File Size | Number | 124000 |
| Storage Key | Single line text | client-assets/recClient/recAsset/logo.png |
| Storage Bucket | Single line text | automatedge-dashboard-assets |
| Public URL | URL | https://cdn.example.com/client-assets/... |
| Description | Long text | Primary logo |
| Status | Single select: UPLOADED, REVIEWED, APPROVED, REJECTED, NEEDS_REPLACEMENT | UPLOADED |
| Operator Notes | Long text | Needs transparent SVG |
| Visible To Client | Checkbox | checked |
| Created At | Date/time or single line text | 2026-05-14T10:00:00.000Z |
| Updated At | Date/time or single line text | 2026-05-14T10:00:00.000Z |

Actual media files are stored in S3-compatible object storage. Airtable stores metadata only.

## Access Requests

| Field | Type | Example |
| --- | --- | --- |
| Client Record ID | Single line text | recClient |
| Platform | Single select: WEBSITE, DOMAIN_DNS, CRM, EMAIL_MARKETING, CALENDAR_BOOKING, FORM_TOOL, AUTOMATION_TOOL, ANALYTICS_TRACKING, PAYMENT_PLATFORM, SMS_WHATSAPP, SOCIAL_MEDIA, BRAND_FOLDER, OTHER | DOMAIN_DNS |
| Platform Name | Single line text | Cloudflare |
| Status | Single select: NOT_REQUESTED, REQUESTED, AWAITING_CLIENT, RECEIVED, CONNECTED, FAILED, NOT_NEEDED | AWAITING_CLIENT |
| Required | Checkbox | checked |
| Requested By User ID | Single line text | recOperator |
| Who Will Provide Access | Single line text | Amelia |
| Preferred Access Method | Single select or text | Secure invite |
| Access Restrictions | Long text | Limited DNS access |
| Target Date | Date | 2026-05-20 |
| Instructions | Long text | Invite ops user |
| Client Notes | Long text | Waiting on admin |
| Operator Notes | Long text | No password requested |
| Created At | Date/time or single line text | 2026-05-14T10:00:00.000Z |
| Updated At | Date/time or single line text | 2026-05-14T10:00:00.000Z |

Do not create password, API key, or credential fields.

## Build Phases

| Field | Type | Example |
| --- | --- | --- |
| Client Record ID | Single line text | recClient |
| Phase | Single select: STRATEGY, FUNNEL_MAP, LANDING_APPLICATION, CRM_PIPELINE, BOOKING_FLOW, FOLLOW_UP_AUTOMATION, REPORTING_VIEW, QA, LAUNCH, OPTIMISATION | BOOKING_FLOW |
| Title | Single line text | Booking Flow |
| Description | Long text | Calendar, reminders, confirmation |
| Status | Single select: NOT_STARTED, IN_PROGRESS, BLOCKED, AWAITING_CLIENT, IN_REVIEW, COMPLETE | IN_PROGRESS |
| Sort Order | Number | 5 |
| Due Date | Date | 2026-05-25 |
| Completed At | Date/time or single line text | 2026-05-25T12:00:00.000Z |
| Blocking Reason | Long text | Waiting for DNS |
| Visible To Client | Checkbox | checked |
| Created At | Date/time or single line text | 2026-05-14T10:00:00.000Z |
| Updated At | Date/time or single line text | 2026-05-14T10:00:00.000Z |

## Tasks

| Field | Type | Example |
| --- | --- | --- |
| Client Record ID | Single line text | recClient |
| Title | Single line text | Upload proof assets |
| Description | Long text | Add testimonials and screenshots |
| Assigned To Type | Single select: CLIENT, OPERATOR, ADMIN | CLIENT |
| Assigned To User ID | Single line text | recUser |
| Priority | Single select: LOW, MEDIUM, HIGH, URGENT | HIGH |
| Status | Single select: TODO, IN_PROGRESS, BLOCKED, DONE, CANCELLED | TODO |
| Due Date | Date | 2026-05-20 |
| Visible To Client | Checkbox | checked |
| Related Entity Type | Single line text | Asset |
| Related Entity ID | Single line text | recAsset |
| Created By User ID | Single line text | recOperator |
| Completed At | Date/time or single line text | 2026-05-20T10:00:00.000Z |
| Created At | Date/time or single line text | 2026-05-14T10:00:00.000Z |
| Updated At | Date/time or single line text | 2026-05-14T10:00:00.000Z |

## Reports

| Field | Type | Example |
| --- | --- | --- |
| Client Record ID | Single line text | recClient |
| Period Start | Date | 2026-05-01 |
| Period End | Date | 2026-05-07 |
| Lead Volume | Number | 86 |
| Qualified Leads | Number | 34 |
| Booked Calls | Number | 18 |
| Show Ups | Number | 15 |
| No Shows | Number | 3 |
| Sales Closed | Number | 4 |
| Revenue | Currency or number | 24000 |
| Pipeline Value | Currency or number | 52000 |
| Lead Source Breakdown | Long text | Instagram: 42, LinkedIn: 18 |
| Booking Rate | Number | 21 |
| Show Up Rate | Number | 83 |
| Close Rate | Number | 27 |
| No Show Rate | Number | 17 |
| Follow Up Response Rate | Number | 31 |
| Top Performing Source | Single line text | Instagram |
| Bottleneck Diagnosis | Long text | No-show recovery needs tightening |
| Operator Summary | Long text | Internal summary |
| Client Summary | Long text | Client-facing summary |
| Next Actions | Long text | Improve reminder copy |
| Status | Single select: DRAFT, PUBLISHED, ARCHIVED | PUBLISHED |
| Published At | Date/time or single line text | 2026-05-14T10:00:00.000Z |
| Created By User ID | Single line text | recOperator |
| Created At | Date/time or single line text | 2026-05-14T10:00:00.000Z |
| Updated At | Date/time or single line text | 2026-05-14T10:00:00.000Z |

Clients only receive records where `Status = PUBLISHED`.

## Audit Scores

| Field | Type | Example |
| --- | --- | --- |
| Client Record ID | Single line text | recClient |
| Offer Clarity | Number | 8 |
| Ideal Client Profile | Number | 7 |
| Content To Funnel Path | Number | 6 |
| Profile And Link In Bio | Number | 8 |
| Landing Page | Number | 5 |
| Lead Capture | Number | 6 |
| Application Form | Number | 7 |
| Booking Flow | Number | 7 |
| CRM And Pipeline | Number | 5 |
| Follow Up System | Number | 4 |
| No Show Reduction | Number | 5 |
| Sales Handoff | Number | 6 |
| Tracking And Attribution | Number | 4 |
| Automation And Tool Stack | Number | 5 |
| Compliance And Trust | Number | 8 |
| Total Score | Number | 91 |
| Top Revenue Leaks | Long text | Follow-up, tracking |
| Operational Risk | Long text | Manual lead movement |
| Commercial Impact | Long text | Missed booked calls |
| Recommended Fix | Long text | Add no-show recovery |
| Next Step | Long text | Operator review |
| Visible To Client | Checkbox | checked |
| Created By User ID | Single line text | recOperator |
| Created At | Date/time or single line text | 2026-05-14T10:00:00.000Z |
| Updated At | Date/time or single line text | 2026-05-14T10:00:00.000Z |

## Internal Notes

| Field | Type | Example |
| --- | --- | --- |
| Client Record ID | Single line text | recClient |
| Note | Long text | Waiting for DNS access |
| Category | Single select: GENERAL, RISK, SALES, TECHNICAL, CLIENT_COMMS, REPORTING, ACCESS, ASSET_REVIEW | RISK |
| Created By User ID | Single line text | recOperator |
| Created At | Date/time or single line text | 2026-05-14T10:00:00.000Z |
| Updated At | Date/time or single line text | 2026-05-14T10:00:00.000Z |

Clients must never access this table.

## Audit Logs

| Field | Type | Example |
| --- | --- | --- |
| Actor User ID | Single line text | recOperator |
| Client Record ID | Single line text | recClient |
| Action | Single line text | REPORT_PUBLISHED |
| Entity Type | Single line text | Report |
| Entity ID | Single line text | recReport |
| Metadata JSON | Long text | {"status":"PUBLISHED"} |
| Created At | Date/time or single line text | 2026-05-14T10:00:00.000Z |

Audit logs are append-only from the app’s perspective and readable only by operators/admins.
