'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useClinicDates, useSlots } from '@/lib/booking/useSlots';

const dayLabel = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

/** The doctor's next clinic days and free times, live from the availability API. */
export function NextSlots({ doctor }: { doctor: string }) {
  const dates = useClinicDates(doctor);
  const [picked, setPicked] = useState<string>();
  const date = picked ?? dates.data?.[0];
  const slots = useSlots(doctor, date);

  return (
    <div className="side-card">
      <h2>Next available</h2>
      {dates.isLoading ? <p>Loading clinic days…</p> : null}
      {dates.data ? (
        <div className="day-pills" role="group" aria-label="Clinic days">
          {dates.data.slice(0, 5).map((d) => (
            <button
              key={d}
              type="button"
              className="pill"
              aria-pressed={d === date}
              onClick={() => setPicked(d)}
            >
              {dayLabel(d)}
            </button>
          ))}
        </div>
      ) : null}
      {slots.isLoading ? <p>Loading times…</p> : null}
      {slots.data ? (
        slots.data.some((s) => s.available) ? (
          <ul className="slot-grid" aria-label={`Free times on ${date ? dayLabel(date) : ''}`}>
            {slots.data
              .filter((s) => s.available)
              .slice(0, 6)
              .map((s) => (
                <li key={s.value}>
                  <Link className="slot" href={`/book?doctor=${doctor}&date=${date}&time=${s.value}`}>
                    {s.time}
                  </Link>
                </li>
              ))}
          </ul>
        ) : (
          <p>No free times that day. Try another day.</p>
        )
      ) : null}
      {dates.isError || slots.isError ? (
        <p>Times could not be loaded. Call +91 484 000 2400 to book.</p>
      ) : null}
      <Link className="btn btn-blue" href={`/book?doctor=${doctor}`}>
        See all times and book
      </Link>
    </div>
  );
}
