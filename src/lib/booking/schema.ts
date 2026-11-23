import { z } from 'zod';
import { doctors } from '@/content/doctors';

// The site's CSP forbids eval; without this, zod probes `Function('')` in the browser
// and Chrome logs a CSP violation.
z.config({ jitless: true });

/** One appointment request, validated identically in the browser and on the server. */
export const appointmentSchema = z.object({
  doctor: z.string().refine((s) => doctors.some((d) => d.slug === s), 'Choose a doctor'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Choose a time'),
  mode: z.enum(['hospital', 'video']),
  name: z.string().trim().min(2, 'Enter the patient’s full name').max(80),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?\d[\d\s-]{8,15}\d)$/, 'Enter a phone number we can call, for example +91 98470 12345'),
  email: z.union([z.literal(''), z.email('Enter a valid email address or leave it empty')]),
  forSomeoneElse: z.boolean(),
  reason: z.string().trim().max(500, 'Keep this under 500 characters').optional().default(''),
  consent: z.literal(true, 'Please agree so we can contact you about this appointment'),
  /** Honeypot: real people never see or fill this. */
  website: z.string().max(0).optional().default(''),
});

export type AppointmentInput = z.input<typeof appointmentSchema>;
export type Appointment = z.output<typeof appointmentSchema>;

export type BookingResult =
  | { ok: true; reference: string; mode: 'webhook' | 'demo' }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/** Human-friendly reference such as VH-7K2Q9P (no 0/O/1/I to avoid misreading). */
export function makeReference(random: () => number = Math.random): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return `VH-${Array.from({ length: 6 }, () => chars[Math.floor(random() * chars.length)]).join('')}`;
}
