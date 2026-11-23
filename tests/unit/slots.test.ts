import { describe, expect, it } from 'vitest';
import { clinicDates, kochiNow, label, slotsFor } from '@/lib/booking/slots';

const now = new Date('2026-11-23T03:00:00Z'); // 8:30 am in Kochi, a Monday

describe('appointment slots', () => {
  it('formats times for people', () => {
    expect(label('09:00')).toBe('9:00 am');
    expect(label('14:30')).toBe('2:30 pm');
    expect(label('12:00')).toBe('12:00 pm');
  });

  it('uses Kochi time whatever the server time zone', () => {
    expect(kochiNow(now)).toEqual({ date: '2026-11-23', minutes: 8 * 60 + 30 });
  });

  it('has no slots on days the doctor does not hold a clinic', () => {
    expect(slotsFor('meera-k', '2026-11-25', now)).toEqual([]); // Wednesday
  });

  it('is deterministic and never offers past times', () => {
    const a = slotsFor('meera-k', '2026-11-23', now);
    expect(a).toEqual(slotsFor('meera-k', '2026-11-23', now));
    expect(a.find((s) => s.value === '09:00')?.available).toBe(false); // within the next hour
    expect(slotsFor('meera-k', '2026-11-20', now)).toEqual([]);
  });

  it('lists only clinic days that still have a free time', () => {
    const dates = clinicDates('meera-k', now, 6);
    expect(dates).toHaveLength(6);
    for (const d of dates) expect(slotsFor('meera-k', d, now).some((s) => s.available)).toBe(true);
  });
});
