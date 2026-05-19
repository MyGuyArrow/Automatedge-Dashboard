import 'server-only';

import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { z } from 'zod';

import { createAuditLogRecord } from '@/lib/airtable/auditLogs';
import { getClient, updateClientRecord } from '@/lib/airtable/clients';
import {
  createUser,
  findUserByEmail,
  findUserByInviteTokenHash,
  updateUser,
} from '@/lib/airtable/users';
import { hashPassword } from '@/lib/auth/password';
import { recordIdSchema } from '@/lib/validation';
import type { Client, User } from '@/types';

const inviteExpiryMs = 7 * 24 * 60 * 60 * 1000;
const inviteCooldownMs = 24 * 60 * 60 * 1000;

const emailSchema = z.string().trim().toLowerCase().email();
const inviteTokenSchema = z.string().min(20).max(256);

const createClientInviteSchema = z.object({
  clientRecordId: recordIdSchema,
});

const acceptClientInviteSchema = z
  .object({
    token: inviteTokenSchema,
    password: z.string().min(12, 'Password must be at least 12 characters.'),
    confirmPassword: z.string().min(12, 'Confirm your password.'),
  })
  .refine((input) => input.password === input.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type ClientInviteAction = 'SEND_INVITE' | 'SKIP_ACTIVE' | 'SKIP_RECENT';

export type ClientInviteResult =
  | {
      action: 'SEND_INVITE';
      inviteUrl: string;
      email: string;
      fullName: string;
      businessName: string;
      expiresAt: string;
    }
  | {
      action: 'SKIP_ACTIVE';
    }
  | {
      action: 'SKIP_RECENT';
      nextEligibleAt: string;
    };

export type ClientInvitePreview = {
  email: string;
  fullName: string;
  businessName: string;
  expiresAt: string;
};

export class InviteError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'InviteError';
    this.status = status;
  }
}

const normalizeEmail = (email: string) => emailSchema.parse(email);

const fullNameForClient = (client: Client, email: string) =>
  client.primaryContactName || client.clientName || client.businessName || email;

const generateInviteToken = () => randomBytes(32).toString('base64url');

const hashInviteToken = (token: string) => createHash('sha256').update(token).digest('hex');

const parseTime = (value?: string) => {
  if (!value) return undefined;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : undefined;
};

const configuredAppBaseUrl = (requestOrigin?: string) => {
  const url = process.env.APP_URL || process.env.NEXTAUTH_URL || requestOrigin;
  if (!url) throw new InviteError('APP_URL or NEXTAUTH_URL is required to create invite URLs.', 500);
  return url.replace(/\/+$/, '');
};

const buildInviteUrl = (appBaseUrl: string, token: string) => {
  const url = new URL('/accept-invite', appBaseUrl);
  url.searchParams.set('token', token);
  return url.toString();
};

const requireClient = async (clientRecordId: string) => {
  try {
    return await getClient(clientRecordId);
  } catch {
    throw new InviteError('Client record was not found.', 404);
  }
};

const isRecentInvite = (user: User, nowMs: number) => {
  const sentAt = parseTime(user.inviteSentAt);
  const expiresAt = parseTime(user.inviteExpiresAt);
  return Boolean(
    user.status === 'INVITED' &&
      user.inviteTokenHash &&
      sentAt &&
      expiresAt &&
      expiresAt > nowMs &&
      nowMs - sentAt < inviteCooldownMs,
  );
};

const assertReusableClientUser = (user: User, clientRecordId: string) => {
  if (user.role !== 'CLIENT') {
    throw new InviteError('Email belongs to an internal dashboard user.', 409);
  }

  if (user.clientRecordId && user.clientRecordId !== clientRecordId) {
    throw new InviteError('Email is already linked to a different client workspace.', 409);
  }

  if (user.status === 'DISABLED') {
    throw new InviteError('Client user is disabled and requires manual review.', 409);
  }
};

export const assertMakeInviteAuthorization = (authorization: string | null) => {
  const expected = process.env.MAKE_INVITE_API_KEY;
  if (!expected) throw new InviteError('MAKE_INVITE_API_KEY is not configured.', 500);

  const prefix = 'Bearer ';
  if (!authorization?.startsWith(prefix)) {
    throw new InviteError('Missing invite API bearer token.', 401);
  }

  const received = authorization.slice(prefix.length).trim();
  const expectedBytes = Buffer.from(expected);
  const receivedBytes = Buffer.from(received);

  if (
    expectedBytes.length !== receivedBytes.length ||
    !timingSafeEqual(expectedBytes, receivedBytes)
  ) {
    throw new InviteError('Invalid invite API bearer token.', 401);
  }
};

export const createClientInvite = async (
  input: unknown,
  requestOrigin?: string,
): Promise<ClientInviteResult> => {
  const parsed = createClientInviteSchema.parse(input);
  const client = await requireClient(parsed.clientRecordId);
  const email = normalizeEmail(client.primaryContactEmail);
  const fullName = fullNameForClient(client, email);
  const now = new Date();
  const nowMs = now.getTime();
  const existing = await findUserByEmail(email);

  if (existing) {
    assertReusableClientUser(existing, client.id);

    if (existing.status === 'ACTIVE') {
      return { action: 'SKIP_ACTIVE' };
    }

    if (isRecentInvite(existing, nowMs)) {
      return {
        action: 'SKIP_RECENT',
        nextEligibleAt: new Date(parseTime(existing.inviteSentAt)! + inviteCooldownMs).toISOString(),
      };
    }
  }

  const token = generateInviteToken();
  const tokenHash = hashInviteToken(token);
  const expiresAt = new Date(nowMs + inviteExpiryMs).toISOString();
  const inviteUrl = buildInviteUrl(configuredAppBaseUrl(requestOrigin), token);

  const inviteFields = {
    fullName,
    role: 'CLIENT' as const,
    clientRecordId: client.id,
    status: 'INVITED' as const,
    passwordHash: null,
    inviteTokenHash: tokenHash,
    inviteExpiresAt: expiresAt,
    inviteSentAt: now.toISOString(),
    inviteAcceptedAt: null,
  };

  const invitedUser = existing
    ? await updateUser(existing.id, inviteFields)
    : await createUser({
        email,
        fullName,
        role: 'CLIENT',
        clientRecordId: client.id,
        status: 'INVITED',
        inviteTokenHash: tokenHash,
        inviteExpiresAt: expiresAt,
        inviteSentAt: now.toISOString(),
      });

  await createAuditLogRecord({
    actorUserId: invitedUser.id,
    clientRecordId: client.id,
    action: existing ? 'CLIENT_INVITE_REISSUED' : 'CLIENT_INVITE_CREATED',
    entityType: 'User',
    entityId: invitedUser.id,
    metadata: { email, expiresAt },
  });

  return {
    action: 'SEND_INVITE',
    inviteUrl,
    email,
    fullName,
    businessName: client.businessName,
    expiresAt,
  };
};

const getInviteContext = async (token: string) => {
  const parsedToken = inviteTokenSchema.parse(token);
  const user = await findUserByInviteTokenHash(hashInviteToken(parsedToken));

  if (!user || user.role !== 'CLIENT' || user.status !== 'INVITED' || !user.clientRecordId) {
    throw new InviteError('Invite link is invalid or expired.', 400);
  }

  const expiresAt = parseTime(user.inviteExpiresAt);
  if (!expiresAt || expiresAt <= Date.now()) {
    throw new InviteError('Invite link is invalid or expired.', 400);
  }

  const client = await requireClient(user.clientRecordId);
  return { user, client, expiresAt: user.inviteExpiresAt! };
};

export const getClientInvitePreview = async (token: string): Promise<ClientInvitePreview> => {
  const { user, client, expiresAt } = await getInviteContext(token);
  return {
    email: user.email,
    fullName: user.fullName,
    businessName: client.businessName,
    expiresAt,
  };
};

export const acceptClientInvite = async (input: unknown) => {
  const parsed = acceptClientInviteSchema.parse(input);
  const { user, client } = await getInviteContext(parsed.token);
  const acceptedAt = new Date().toISOString();

  const updated = await updateUser(user.id, {
    passwordHash: await hashPassword(parsed.password),
    status: 'ACTIVE',
    inviteTokenHash: null,
    inviteExpiresAt: null,
    inviteAcceptedAt: acceptedAt,
  });
  await updateClientRecord(client.id, { status: 'AWAITING_ASSETS' });

  await createAuditLogRecord({
    actorUserId: updated.id,
    clientRecordId: client.id,
    action: 'CLIENT_INVITE_ACCEPTED',
    entityType: 'User',
    entityId: updated.id,
    metadata: { email: updated.email, acceptedAt, clientStatus: 'AWAITING_ASSETS' },
  });

  return {
    email: updated.email,
    redirectTo: '/client/uploads',
  };
};
