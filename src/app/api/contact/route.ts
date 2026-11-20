import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { contactInquiries } from '@/db/schema';
import { checkContactLimit, getClientIp } from '@/lib/rate-limit';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Valid email is required').max(255),
  service: z.string().max(255).optional(),
  message: z.string().min(5, 'Message must be at least 5 characters').max(5000),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);

  // Rate limit check: max 5 per hour
  const limit = await checkContactLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `Too many submissions. Please try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.`,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfterSeconds) },
      }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, email, service, message } = parsed.data;

  try {
    const [inquiry] = await db
      .insert(contactInquiries)
      .values({
        name,
        email,
        service: service || null,
        message,
        ipAddress: ip,
      })
      .returning();

    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
  } catch (err) {
    console.error('[Contact] DB insert error:', err);
    return NextResponse.json(
      { error: 'Failed to save inquiry. Please try contacting directly via email.' },
      { status: 500 }
    );
  }
}
