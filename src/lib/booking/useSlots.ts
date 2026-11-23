'use client';

import { useQuery } from '@tanstack/react-query';
import type { Slot } from './slots';

/** Free times for a doctor on a date, from /api/availability (TanStack Query caches per doctor and day). */
export function useSlots(doctor: string | undefined, date: string | undefined) {
  return useQuery({
    queryKey: ['slots', doctor, date],
    enabled: Boolean(doctor && date),
    queryFn: async (): Promise<Slot[]> => {
      const res = await fetch(`/api/availability?doctor=${encodeURIComponent(doctor!)}&date=${date}`);
      if (!res.ok) throw new Error('Could not load times');
      const json = (await res.json()) as { slots: Slot[] };
      return json.slots;
    },
  });
}

export function useClinicDates(doctor: string | undefined) {
  return useQuery({
    queryKey: ['dates', doctor],
    enabled: Boolean(doctor),
    queryFn: async (): Promise<string[]> => {
      const res = await fetch(`/api/availability?doctor=${encodeURIComponent(doctor!)}`);
      if (!res.ok) throw new Error('Could not load dates');
      const json = (await res.json()) as { clinicDates: string[] };
      return json.clinicDates;
    },
  });
}
