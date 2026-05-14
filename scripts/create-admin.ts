import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

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

async function main() {
  loadLocalEnv();

  const [{ createUser, findUserByEmail }, { hashPassword }] = await Promise.all([
    import('../src/lib/airtable/users'),
    import('../src/lib/auth/password'),
  ]);

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

  const user = await createUser({
    email,
    fullName,
    passwordHash: await hashPassword(password),
    role: 'ADMIN',
    status: 'ACTIVE',
  });

  console.log(`Created ADMIN user ${user.email} (${user.id}).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
