export const airtableTables = {
  users: process.env.AIRTABLE_USERS_TABLE || 'Users',
  clients: process.env.AIRTABLE_CLIENTS_TABLE || 'Clients',
  intakes: process.env.AIRTABLE_INTAKES_TABLE || 'Fulfilment Intakes',
  assets: process.env.AIRTABLE_ASSETS_TABLE || 'Assets',
  accessRequests: process.env.AIRTABLE_ACCESS_REQUESTS_TABLE || 'Access Requests',
  buildPhases: process.env.AIRTABLE_BUILD_PHASES_TABLE || 'Build Phases',
  tasks: process.env.AIRTABLE_TASKS_TABLE || 'Tasks',
  reports: process.env.AIRTABLE_REPORTS_TABLE || 'Reports',
  auditScores: process.env.AIRTABLE_AUDIT_SCORES_TABLE || 'Audit Scores',
  internalNotes: process.env.AIRTABLE_INTERNAL_NOTES_TABLE || 'Internal Notes',
  auditLogs: process.env.AIRTABLE_AUDIT_LOGS_TABLE || 'Audit Logs',
} as const;
