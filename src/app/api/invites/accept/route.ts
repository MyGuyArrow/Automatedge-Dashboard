import { NextResponse } from 'next/server';
import { z } from 'zod';

import { acceptClientInvite, InviteError } from '@/lib/services/invites';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await acceptClientInvite(body);
    return NextResponse.json(result);
  } catch (error) {
    const status = error instanceof InviteError ? error.status : error instanceof z.ZodError ? 400 : 500;
    const message =
      error instanceof InviteError
        ? error.message
        : error instanceof z.ZodError
          ? error.issues.some((issue) => issue.path[0] === 'token')
            ? 'Invite link is invalid or expired.'
            : error.issues[0]?.message || 'Please check the invite form and try again.'
          : 'Unable to accept invite.';

    return NextResponse.json({ error: message }, { status });
  }
}
