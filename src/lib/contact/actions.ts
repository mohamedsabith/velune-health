'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { clientKey, getRateLimiter } from '@/lib/security/server';

const schema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(80),
  contact: z.string().trim().min(6, 'Enter a phone number or email address').max(120),
  topic: z.enum([
    'Appointments',
    'Bills and insurance',
    'Reports and records',
    'Feedback or complaint',
    'Something else',
  ]),
  message: z.string().trim().min(10, 'Tell us a little more (at least 10 characters)').max(1500),
  website: z.string().max(0).optional().default(''),
});

export type ContactInput = z.input<typeof schema>;
export type ContactResult = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string> };

/** Contact form. Demonstration mode: validated and rate-limited, then logged without personal details. */
export async function sendMessage(input: ContactInput): Promise<ContactResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { ok: false, error: 'Please check the highlighted details.', fieldErrors };
  }
  const rate = await getRateLimiter({ prefix: 'contact', limit: 5, windowMs: 10 * 60_000 }).limit(
    clientKey(await headers()),
  );
  if (!rate.success)
    return { ok: false, error: 'Too many messages from this device. Please call +91 484 000 2400.' };
  console.info('[contact] message received', {
    topic: parsed.data.topic,
    length: parsed.data.message.length,
  });
  return { ok: true };
}
