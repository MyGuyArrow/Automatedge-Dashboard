import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import bcrypt from 'bcryptjs';

const baseUrl = 'https://api.airtable.com/v0';
const saltRounds = 12;

const loadLocalEnv = () => {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
    process.env[key] ||= value;
  }
};

const getConfig = () => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const usersTable = process.env.AIRTABLE_USERS_TABLE || 'Users';

  if (!apiKey || !baseId) {
    throw new Error('Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID.');
  }

  return { apiKey, baseId, usersTable };
};

const tableUrl = () => {
  const { baseId, usersTable } = getConfig();
  return `${baseUrl}/${baseId}/${encodeURIComponent(usersTable)}`;
};

const airtableFetch = async (url, init = {}, attempt = 0) => {
  const { apiKey } = getConfig();
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  if (response.status === 429 && attempt < 3) {
    await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
    return airtableFetch(url, init, attempt + 1);
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Airtable request failed (${response.status}): ${body}`);
  }

  return response.json();
};

const escapeFormulaString = (value) => value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const emailFormula = (email) => `LOWER({Email}) = '${escapeFormulaString(email.toLowerCase())}'`;

const findUserByEmail = async (email) => {
  const url = new URL(tableUrl());
  url.searchParams.set('filterByFormula', emailFormula(email));
  url.searchParams.set('maxRecords', '1');
  const page = await airtableFetch(url.toString());
  return page.records?.[0];
};

const createAdminUser = async ({ email, fullName, passwordHash }) => {
  const timestamp = new Date().toISOString();
  const record = await airtableFetch(tableUrl(), {
    method: 'POST',
    body: JSON.stringify({
      fields: {
        Email: email.toLowerCase(),
        'Password Hash': passwordHash,
        'Full Name': fullName,
        Role: 'ADMIN',
        Status: 'ACTIVE',
        'Created At': timestamp,
        'Updated At': timestamp,
      },
    }),
  });

  return {
    id: record.id,
    email: record.fields?.Email || email,
  };
};

async function main() {
  loadLocalEnv();

  const rl = readline.createInterface({ input, output });
  const email = (await rl.question('Admin email: ')).trim().toLowerCase();
  const fullName = (await rl.question('Full name: ')).trim();
  const password = await rl.question('Password (12+ chars): ');
  rl.close();

  if (!email || !fullName || password.length < 12) {
    throw new Error('Email, full name, and a 12+ character password are required.');
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error(`User already exists: ${email}`);
  }

  const user = await createAdminUser({
    email,
    fullName,
    passwordHash: await bcrypt.hash(password, saltRounds),
  });

  console.log(`Created ADMIN user ${user.email} (${user.id}).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
