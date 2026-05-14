import { NextResponse } from 'next/server';

import { createPresignedUploadUrl } from '@/lib/services/portal';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createPresignedUploadUrl(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to create upload URL.' },
      { status: 400 },
    );
  }
}
