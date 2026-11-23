'use server';

import { createHmac } from 'node:crypto';
import { headers } from 'next/headers';
import { env } from '@/lib/env/server';
import { clientKey, getRateLimiter } from '@/lib/security/server';
import { appointmentSchema, makeReference, type AppointmentInput, type BookingResult } from './schema';
import { slotsFor } from './slots';

const limiter = () => getRateLimiter({ prefix: 'booking', limit: 6, windowMs: 10 * 60_000 });

/**
 * Receives an appointment request. Validates it, checks the slot is still free,
 * rate-limits by client, then forwards it (HMAC-signed) to the hospital's system
 * when BOOKING_WEBHOOK_URL is set. Without it, runs in demonstration mode.
 */
export async function requestAppointment(input: AppointmentInput): Promise<BookingResult> {
  const parsed = appointmentSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { ok: false, error: 'Please check the highlighted details.', fieldErrors };
  }
  const data = parsed.data;
  const h = await headers();
  const rate = await limiter().limit(clientKey(h));
  if (!rate.success)
    return { ok: false, error: 'Too many requests from this device. Please call +91 484 000 2400 to book.' };

  const slot = slotsFor(data.doctor, data.date).find((s) => s.value === data.time);
  if (!slot?.available)
    return {
      ok: false,
      error: 'Sorry, that time has just been taken. Please choose another.',
      fieldErrors: { time: 'This time is no longer free' },
    };

  const reference = makeReference();
  const { BOOKING_WEBHOOK_URL: url, BOOKING_WEBHOOK_SECRET: secret } = env.raw;
  if (url && secret) {
    const { website: _honeypot, consent: _consent, ...appointment } = data;
    const body = JSON.stringify({ reference, appointment, receivedAt: new Date().toISOString() });
    const signature = createHmac('sha256', secret).update(body).digest('hex');
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Velune-Signature': `sha256=${signature}` },
        body,
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (error) {
      console.error('[booking] webhook failed', error instanceof Error ? error.message : error);
      return {
        ok: false,
        error: 'We could not send your request just now. Please try again, or call +91 484 000 2400.',
      };
    }
    return { ok: true, reference, mode: 'webhook' };
  }
  return { ok: true, reference, mode: 'demo' };
}
