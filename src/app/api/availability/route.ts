import { z } from 'zod';
import { doctors } from '@/content/doctors';
import { clinicDates, slotsFor } from '@/lib/booking/slots';
import { clientKey, getRateLimiter } from '@/lib/security/server';

const query = z.object({
  doctor: z.string().refine((s) => doctors.some((d) => d.slug === s), 'Unknown doctor'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

/** Free appointment times for a doctor (GET /api/availability?doctor=meera-k&date=2026-12-01). */
export async function GET(request: Request) {
  const rate = await getRateLimiter({ prefix: 'availability', limit: 120, windowMs: 60_000 }).limit(
    clientKey(request.headers),
  );
  if (!rate.success)
    return Response.json(
      { error: 'Too many requests. Try again in a minute.' },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  const url = new URL(request.url);
  const parsed = query.safeParse({
    doctor: url.searchParams.get('doctor') ?? '',
    date: url.searchParams.get('date') ?? undefined,
  });
  if (!parsed.success)
    return Response.json(
      { error: 'Pass a known doctor slug and an optional date (YYYY-MM-DD).' },
      { status: 400 },
    );
  const { doctor, date } = parsed.data;
  return Response.json(
    date ? { doctor, date, slots: slotsFor(doctor, date) } : { doctor, clinicDates: clinicDates(doctor) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
