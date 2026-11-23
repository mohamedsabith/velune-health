'use client';

import Link from 'next/link';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { ensureGsap, prefersMotion } from '@/animations/gsap';
import { departments } from '@/content/departments';
import { doctors } from '@/content/doctors';
import { site } from '@/content/site';
import { label } from '@/lib/booking/slots';
import { useBooking } from '@/lib/booking/store';
import { formatInr } from '@/lib/utils';

const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

/** Confirmation with a tick that draws itself, the booking reference and what to do next. */
export function Confirmed() {
  const stored = useBooking((s) => s.confirmed);
  // The booking lives in sessionStorage, so render nothing until the browser has it (no hydration mismatch).
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const c = mounted ? stored : undefined;
  const tick = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!c || !tick.current || !prefersMotion()) return;
    const { gsap } = ensureGsap();
    const paths = tick.current.querySelectorAll<SVGGeometryElement>('circle, path');
    const ctx = gsap.context(() => {
      paths.forEach((p) => {
        const l = p.getTotalLength();
        gsap.fromTo(
          p,
          { strokeDasharray: l, strokeDashoffset: l },
          {
            strokeDashoffset: 0,
            duration: p.tagName === 'circle' ? 0.9 : 0.5,
            delay: p.tagName === 'circle' ? 0.1 : 0.75,
            ease: 'power2.inOut',
          },
        );
      });
      gsap.from('.conf-rise', {
        y: 20,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        delay: 0.5,
        ease: 'expo.out',
      });
    });
    return () => ctx.revert();
  }, [c]);

  if (c === undefined) return <p className="muted">Loading…</p>;
  if (!c)
    return (
      <div>
        <h1 className="p-title">No appointment to show</h1>
        <p className="lead" style={{ marginTop: 16 }}>
          This page shows the details straight after you book. <Link href="/book">Book an appointment</Link>.
        </p>
      </div>
    );

  const doctor = doctors.find((d) => d.slug === c.doctor);
  const dept = departments.find((d) => d.slug === c.department);
  return (
    <div className="confirm">
      <svg ref={tick} className="tick" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="29" fill="none" stroke="#1E3A8A" strokeWidth="2.5" />
        <path
          d="M19 33.5l8.5 8.5L45.5 23"
          fill="none"
          stroke="#E0B45A"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h1 className="p-title conf-rise">Your appointment is booked</h1>
      <p className="lead conf-rise">
        We have sent the details to {c.phone}. Please arrive 15 minutes early
        {c.mode === 'video' ? '; your video link arrives by SMS an hour before' : ''}.
      </p>
      {c.demo ? (
        <p className="note gold conf-rise" style={{ marginTop: 20 }}>
          Demonstration: this concept website does not send real bookings or messages.
        </p>
      ) : null}
      <dl className="rows conf-rise" style={{ marginTop: 32 }}>
        <div>
          <dt>Reference</dt>
          <dd className="ref">{c.reference}</dd>
        </div>
        <div>
          <dt>Patient</dt>
          <dd>{c.name}</dd>
        </div>
        <div>
          <dt>Doctor</dt>
          <dd>{doctor ? `${doctor.name}, ${dept?.name}` : '—'}</dd>
        </div>
        <div>
          <dt>When</dt>
          <dd>
            {longDate(c.date)}, {label(c.time)}
          </dd>
        </div>
        <div>
          <dt>Where</dt>
          <dd>
            {c.mode === 'video' ? 'Video consultation' : `Outpatient clinics, ${site.address.mainEntrance}`}
          </dd>
        </div>
        <div>
          <dt>Fee</dt>
          <dd>{doctor ? formatInr(doctor.fee) : '—'}</dd>
        </div>
      </dl>
      <h2 className="conf-rise" style={{ marginTop: 48, fontSize: 28 }}>
        Before you come
      </h2>
      <ul className="ticks conf-rise" style={{ marginTop: 14 }}>
        <li>Bring a photo ID and your insurance card if you have one.</li>
        <li>Bring a list of your medicines and any previous reports or scans.</li>
        <li>Need to change the time? Call {site.phones.appointments}; there is no charge.</li>
      </ul>
      <div className="acts conf-rise" style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link className="btn btn-blue" href="/patients">
          Information for patients
        </Link>
        <Link className="btn btn-line" href="/">
          Back to the home page
        </Link>
      </div>
    </div>
  );
}
