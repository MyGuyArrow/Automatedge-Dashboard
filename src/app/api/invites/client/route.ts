import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  assertMakeInviteAuthorization,
  createClientInvite,
  InviteError,
} from '@/lib/services/invites';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    assertMakeInviteAuthorization(request.headers.get('authorization'));
    const body = await request.json();
    const result = await createClientInvite(body, new URL(request.url).origin);
    return NextResponse.json(result);
  } catch (error) {
    const status = error instanceof InviteError ? error.status : error instanceof z.ZodError ? 400 : 500;
    const message =
      error instanceof InviteError
        ? error.message
        : error instanceof z.ZodError
          ? error.issues[0]?.message || 'Invalid invite request.'
          : 'Unable to create client invite.';

    return NextResponse.json({ error: message }, { status });
  }
}
