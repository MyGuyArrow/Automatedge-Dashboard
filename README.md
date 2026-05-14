# AutomatEdge Fulfilment Dashboard

Independent full-stack Next.js dashboard for AutomatEdge fulfilment operations. This app is built locally inside the `Dashboard` directory and is intended for a separate EC2 Ubuntu deployment at `dashboard.automatedge.co.uk`.

It does not integrate with the existing AWS Amplify marketing website.

## 1. Local Development Setup

```powershell
cd "C:\Users\arjun\Documents\New project 6\Dashboard"
npm install
copy .env.example .env
npm run dev
```

Open `http://localhost:3000`.

If PowerShell blocks npm on Windows, use:

```powershell
npm.cmd run dev
```

## 2. Environment Variables

Set these in `.env` locally and on EC2:

```env
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
AIRTABLE_USERS_TABLE=Users
AIRTABLE_CLIENTS_TABLE=Clients
AIRTABLE_INTAKES_TABLE=Fulfilment Intakes
AIRTABLE_ASSETS_TABLE=Assets
AIRTABLE_ACCESS_REQUESTS_TABLE=Access Requests
AIRTABLE_BUILD_PHASES_TABLE=Build Phases
AIRTABLE_TASKS_TABLE=Tasks
AIRTABLE_REPORTS_TABLE=Reports
AIRTABLE_AUDIT_SCORES_TABLE=Audit Scores
AIRTABLE_INTERNAL_NOTES_TABLE=Internal Notes
AIRTABLE_AUDIT_LOGS_TABLE=Audit Logs
AUTH_SECRET=
APP_URL=https://dashboard.automatedge.co.uk
NEXTAUTH_URL=https://dashboard.automatedge.co.uk
AWS_REGION=eu-west-2
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=
S3_PUBLIC_BASE_URL=
```

Generate `AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

## 3. Airtable Base Setup

Create one Airtable base for the dashboard. Add the tables and fields listed in [docs/AIRTABLE_SCHEMA.md](docs/AIRTABLE_SCHEMA.md). Field names must match exactly.

Use single select fields for status/category/role values, checkbox fields for booleans, number fields for metrics, and long text for operational notes.

## 4. Airtable API Token Setup

Create an Airtable personal access token with access to the dashboard base. The token needs read/write permissions for all dashboard tables. Store it only in `.env` as `AIRTABLE_API_KEY`.

Never expose this key to browser code. All Airtable calls are made from server-side modules under `src/lib/airtable`.

## 5. Airtable Field Naming Rules

The service layer uses exact Airtable field names such as `Client Record ID`, `Password Hash`, and `Visible To Client`. Avoid renaming fields after launch. If Airtable field names change, update the mapper and table service files together.

## 6. Admin Creation Command

After Airtable tables exist and `.env` is configured:

```bash
npm run create-admin
```

The script asks for email, full name, and password, hashes the password with bcrypt, and creates an `ADMIN` user in Airtable.

## 7. Create Operators

For the MVP, create operators either directly in Airtable or through the server service function `createOperatorUser`. Operator records use:

- `Role = OPERATOR`
- `Status = ACTIVE`
- `Password Hash` only, never raw passwords
- blank `Client Record ID`

## 8. Create First Client

Log in as an operator/admin and open:

```text
/operator/clients/new
```

Submitting the form creates a `Clients` record and default `Build Phases` records:

1. Strategy
2. Funnel Map
3. Landing/Application
4. CRM Pipeline
5. Booking Flow
6. Follow-Up Automation
7. Reporting View
8. QA
9. Launch
10. Optimisation

## 9. Create Client User

Client users must have:

- `Role = CLIENT`
- `Status = ACTIVE` or `INVITED`
- `Client Record ID = Airtable record ID of their client`
- `Password Hash`, never raw password

The service function `createClientUser` hashes passwords and links users to a client workspace.

## 10. Upload Assets

Client uploads use this flow:

1. Browser requests `/api/assets/presign`.
2. Server validates session, role, `Client Record ID`, file type, and file size.
3. Server creates an `Assets` metadata record in Airtable.
4. Server returns a presigned S3 upload URL.
5. Browser uploads directly to S3.
6. Airtable stores `Storage Key`, bucket, metadata, and review status.

Storage key convention:

```text
client-assets/{clientRecordId}/{assetRecordId}/{filename}
```

Allowed MIME types are configured in `src/lib/constants.ts`.

## 11. Publish Reports

Operators create manual report drafts with `createReportDraft` and publish with `publishReport`. Clients only see records where:

```text
Reports.Status = PUBLISHED
```

No Meta, GA4, Stripe, Calendly, ManyChat, HubSpot, or GoHighLevel integrations are included in this MVP.

## 12. Build Command

```bash
npm run typecheck
npm run lint
npm run build
```

## 13. Production EC2 Setup

Install Node.js 20+, npm, PM2, Nginx, and Certbot on Ubuntu:

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
sudo npm install -g pm2
node -v
npm -v
```

Create the app directory:

```bash
sudo mkdir -p /var/www/Dashboard
sudo chown -R $USER:$USER /var/www/Dashboard
```

## 14. EC2 Deployment Option A: Git Deployment

```bash
cd /var/www
git clone <your-dashboard-repo-url> Dashboard
cd /var/www/Dashboard
npm install
nano .env
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

For updates:

```bash
cd /var/www/Dashboard
git pull
npm install
npm run build
pm2 restart automatedge-dashboard
```

## 15. EC2 Deployment Option B: rsync Deployment

From the local `Dashboard` folder:

```bash
rsync -avz --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude .env \
  --exclude .git \
  ./ ubuntu@YOUR_EC2_IP:/var/www/Dashboard/
```

On EC2:

```bash
cd /var/www/Dashboard
npm install
nano .env
npm run build
pm2 start ecosystem.config.js
pm2 restart automatedge-dashboard
pm2 save
```

## 16. PM2 Commands

```bash
pm2 start ecosystem.config.js
pm2 restart automatedge-dashboard
pm2 logs automatedge-dashboard
pm2 save
```

The PM2 app name is `automatedge-dashboard` and the default production port is `3000`.

## 17. Nginx Reverse Proxy

Copy the example config:

```bash
sudo cp deploy/nginx/dashboard.automatedge.co.uk.conf.example /etc/nginx/sites-available/dashboard.automatedge.co.uk
sudo ln -s /etc/nginx/sites-available/dashboard.automatedge.co.uk /etc/nginx/sites-enabled/dashboard.automatedge.co.uk
sudo nginx -t
sudo systemctl reload nginx
```

The config proxies:

```text
dashboard.automatedge.co.uk -> http://127.0.0.1:3000
```

## 18. Certbot HTTPS

Point the `dashboard.automatedge.co.uk` DNS record to the EC2 instance first, then run:

```bash
sudo certbot --nginx -d dashboard.automatedge.co.uk
sudo certbot renew --dry-run
```

## 19. Manual AWS Steps

Create an S3 bucket for uploaded assets. Recommended baseline:

- Block public access unless you intentionally serve through a CDN/public base URL.
- Create an IAM user or role with scoped `s3:PutObject`, `s3:GetObject`, and optional `s3:DeleteObject` for the bucket/prefix.
- Store AWS credentials in `.env` on EC2 only.
- Set `S3_BUCKET_NAME` and `AWS_REGION`.
- Set `S3_PUBLIC_BASE_URL` only if objects are intentionally readable through CloudFront or another controlled public URL.

## 20. Security Checklist

- Airtable API key is server-side only.
- Clients never call Airtable directly.
- Every server service checks role and `Client Record ID` before returning client-owned data.
- CLIENT users cannot read draft reports.
- CLIENT users cannot read internal notes.
- CLIENT users cannot generate presigned URLs for another workspace.
- Access requests contain no password/API key fields.
- User passwords are stored only as bcrypt hashes.
- Sessions use Auth.js/NextAuth HTTP-only cookies.
- Audit logs are created for important actions.

## 21. Security Limitations

Airtable does not provide row-level security for this app. Tenant isolation is enforced in `src/lib/services/portal.ts` before Airtable reads/writes. Do not bypass these services from UI or API routes.

S3 presigned URLs grant temporary write access to a single generated object key. Keep URL expiry short and keep bucket credentials scoped.

This MVP does not include password reset email delivery. Reset requests should be handled by an admin/operator until a transactional email provider is added.

## 22. Suggested Make.io Automations

- When `Assets.Status` becomes `UPLOADED`, notify the assigned operator.
- When `Access Requests.Status` becomes `AWAITING_CLIENT`, notify the client.
- When a `Tasks` record with `Assigned To Type = CLIENT` is created, notify the client.
- When `Reports.Status` becomes `PUBLISHED`, email the client.
- When `Clients.Status` changes to `LIVE`, send an internal notification.
- When `Build Phases.Status` becomes `BLOCKED`, notify operator/admin.

## 23. Optional Demo Seed

After `.env` and Airtable tables are configured:

```bash
npm run seed:airtable
```

This creates demo users, clients, build phases, asset metadata, access requests, tasks, reports, and an internal note. It is never run automatically.

Demo seeded users use the password shown by the script output. Change it immediately if the seed is used outside a throwaway base.

## 24. Project Structure

```text
src/app                 Next.js app routes and internal API routes
src/components          Operational dashboard UI
src/lib/airtable        Airtable table wrappers and mappers
src/lib/auth            NextAuth credentials provider and password hashing
src/lib/authorization   Server-side role/workspace checks
src/lib/s3              Presigned S3 upload helpers
src/lib/services        Portal business operations and audit logging
src/types               Shared TypeScript domain types
scripts                 Manual Airtable admin/seed scripts
deploy/nginx            EC2 Nginx example config
docs                    Airtable schema documentation
```
