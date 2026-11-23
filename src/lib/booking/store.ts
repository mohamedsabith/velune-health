'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface BookingDraft {
  department: string;
  doctor: string;
  date: string;
  time: string;
  mode: 'hospital' | 'video';
  name: string;
  phone: string;
  email: string;
  forSomeoneElse: boolean;
  reason: string;
  consent: boolean;
}

export interface Confirmed extends BookingDraft {
  reference: string;
  demo: boolean;
}

interface BookingState {
  draft: BookingDraft;
  confirmed: Confirmed | null;
  set: (patch: Partial<BookingDraft>) => void;
  reset: () => void;
  confirm: (reference: string, demo: boolean) => void;
}

const empty: BookingDraft = {
  department: '',
  doctor: '',
  date: '',
  time: '',
  mode: 'hospital',
  name: '',
  phone: '',
  email: '',
  forSomeoneElse: false,
  reason: '',
  consent: false,
};

/** Booking state (Zustand), kept in sessionStorage so a refresh or the confirmation page keeps it. */
export const useBooking = create<BookingState>()(
  persist(
    (set, get) => ({
      draft: empty,
      confirmed: null,
      set: (patch) => set({ draft: { ...get().draft, ...patch } }),
      reset: () => set({ draft: empty }),
      confirm: (reference, demo) => set({ confirmed: { ...get().draft, reference, demo }, draft: empty }),
    }),
    { name: 'velune:booking', storage: createJSONStorage(() => sessionStorage) },
  ),
);
