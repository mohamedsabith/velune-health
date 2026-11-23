import { doctors, type Doctor } from '@/content/doctors';

export interface Slot {
  time: string;
  /** 24-hour HH:MM, for forms and machines. */
  value: string;
  available: boolean;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIMES = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
];

/** Small deterministic hash so the same doctor and day always show the same booked slots. */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function label(value: string): string {
  const [h, m] = value.split(':').map(Number) as [number, number];
  const suffix = h >= 12 ? 'pm' : 'am';
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** ISO date (YYYY-MM-DD) in local time. */
export function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function parseIsoDate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Today's date and minutes past midnight in Kochi (the server may run in another time zone). */
export function kochiNow(at = new Date()): { date: string; minutes: number } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(at)
      .map((p) => [p.type, p.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

export function worksOn(doctor: Doctor, date: Date): boolean {
  return doctor.days.includes(WEEKDAYS[date.getDay()]!);
}

/**
 * Outpatient slots for a doctor on a date. Demonstration data: a real deployment
 * would read the hospital's scheduling system instead (see BOOKING_WEBHOOK_URL).
 */
export function slotsFor(doctorSlug: string, date: string, now = new Date()): Slot[] {
  const doctor = doctors.find((d) => d.slug === doctorSlug);
  const day = parseIsoDate(date);
  if (!doctor || !day || !worksOn(doctor, day)) return [];
  const { date: today, minutes } = kochiNow(now);
  if (date < today) return [];
  return TIMES.map((value) => {
    const [h, m] = value.split(':').map(Number) as [number, number];
    const past = date === today && h * 60 + m <= minutes + 60;
    const taken = hash(`${doctorSlug}:${date}:${value}`) % 3 === 0;
    return { value, time: label(value), available: !past && !taken };
  });
}

/** The next dates (up to `limit`) on which the doctor holds a clinic with at least one free time. */
export function clinicDates(doctorSlug: string, from = new Date(), limit = 14): string[] {
  const doctor = doctors.find((d) => d.slug === doctorSlug);
  if (!doctor) return [];
  const out: string[] = [];
  const d = parseIsoDate(kochiNow(from).date)!;
  for (let i = 0; i < 60 && out.length < limit; i++) {
    const iso = isoDate(d);
    if (worksOn(doctor, d) && slotsFor(doctorSlug, iso, from).some((s) => s.available)) out.push(iso);
    d.setDate(d.getDate() + 1);
  }
  return out;
}
