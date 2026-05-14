# Manual QA Checklist

Run these checks against a local Airtable base and S3 test bucket before EC2 deployment.

## Authentication and Roles

- [ ] Unauthenticated users are redirected to `/login`.
- [ ] CLIENT users are redirected to `/client/dashboard`.
- [ ] OPERATOR users are redirected to `/operator/clients`.
- [ ] ADMIN users are redirected to `/operator/clients`.
- [ ] Disabled users cannot log in.
- [ ] Admin can create or manage users.

## Client Isolation

- [ ] Client cannot access another client’s dashboard by changing the URL or request payload.
- [ ] Client cannot access operator routes.
- [ ] Client cannot view `Internal Notes`.
- [ ] Client cannot view a `DRAFT` report.
- [ ] Client can view a `PUBLISHED` report for their workspace.
- [ ] Client can upload only to their own workspace path.
- [ ] Client cannot create a presigned upload URL for another `Client Record ID`.
- [ ] Client cannot update operator-only access request fields.
- [ ] Client can only mark visible client tasks as `IN_PROGRESS` or `DONE`.

## Operator and Admin

- [ ] Operator can view all clients.
- [ ] Operator can create a client and default build phases appear in Airtable.
- [ ] Operator can create access requests.
- [ ] Operator can publish a report.
- [ ] Published report appears to the client.
- [ ] Draft report does not appear to the client.
- [ ] Operator can review uploaded asset metadata.
- [ ] Operator can create internal notes.
- [ ] Admin-only page rejects OPERATOR users.

## Security

- [ ] No raw password fields exist in Airtable.
- [ ] Access requests do not store raw passwords, API keys, or private credentials.
- [ ] User records store only `Password Hash`.
- [ ] Airtable API key is never exposed to browser bundles or network responses.
- [ ] S3 presigned upload URL expires and is scoped to the generated object key.
- [ ] Asset upload creates metadata in Airtable.
- [ ] Presigned upload URL works for allowed MIME types.
- [ ] Unsupported file types are rejected before upload.
- [ ] Audit logs are created for important operator actions.

## Make.io Compatibility

- [ ] Make.io can watch `Assets.Status = UPLOADED`.
- [ ] Make.io can watch `Access Requests.Status = AWAITING_CLIENT`.
- [ ] Make.io can watch `Tasks.Assigned To Type = CLIENT`.
- [ ] Make.io can watch `Reports.Status = PUBLISHED`.
- [ ] Make.io can watch `Clients.Status = LIVE`.
- [ ] Make.io can watch `Build Phases.Status = BLOCKED`.

## Dashboard

- [ ] Client dashboard summary loads correctly.
- [ ] Build phase progress displays.
- [ ] Required Client Actions display open visible client tasks.
- [ ] This Week’s Diagnosis uses the latest published report.
- [ ] What AutomatEdge is doing next uses report next actions.
- [ ] Operator summary cards load from Airtable-backed data.
