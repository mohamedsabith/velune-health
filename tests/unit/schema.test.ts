import { describe, expect, it } from 'vitest';
import { appointmentSchema, makeReference } from '@/lib/booking/schema';

const valid = {
  doctor: 'meera-k',
  date: '2026-12-01',
  time: '10:00',
  mode: 'hospital',
  name: 'Anjali Menon',
  phone: '+91 98470 12345',
  email: '',
  forSomeoneElse: false,
  reason: '',
  consent: true,
  website: '',
} as const;

describe('appointment form validation', () => {
  it('accepts a complete request', () => {
    expect(appointmentSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ['doctor', 'nobody'],
    ['name', 'A'],
    ['phone', '12'],
    ['email', 'not-an-email'],
    ['consent', false],
    ['website', 'spam'],
  ])('rejects a bad %s', (field, value) => {
    expect(appointmentSchema.safeParse({ ...valid, [field]: value }).success).toBe(false);
  });

  it('makes readable references', () => {
    expect(makeReference()).toMatch(/^VH-[A-HJ-NP-Z2-9]{6}$/);
  });
});
