'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Icon } from '@/components/ui/Icon';
import { departments } from '@/content/departments';
import { doctors } from '@/content/doctors';
import { photos } from '@/content/images';
import { site } from '@/content/site';
import { requestAppointment } from '@/lib/booking/actions';
import { appointmentSchema } from '@/lib/booking/schema';
import { label as timeLabel } from '@/lib/booking/slots';
import { useBooking } from '@/lib/booking/store';
import { useClinicDates, useSlots } from '@/lib/booking/useSlots';
import { formatInr, tel } from '@/lib/utils';

const STEPS = ['Department', 'Doctor', 'Date and time', 'Your details'] as const;

const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
const shortDate = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  return {
    day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
    date: d.getDate(),
    month: d.toLocaleDateString('en-IN', { month: 'short' }),
  };
};

/**
 * Appointment booking in four short steps: department, doctor, date and time,
 * then the patient's details. A summary beside the form shows every choice and
 * lets you jump back. Free times come live from /api/availability.
 */
export function BookingForm() {
  return <BookingFlow params={useSearchParams()} />;
}

const NO_PARAMS = new URLSearchParams();

/**
 * Server-rendered first step, shown until the browser reads the URL. It has the same
 * layout as the live form, so nothing below it moves when the form takes over.
 */
export function BookingFormFallback() {
  return <BookingFlow params={NO_PARAMS} />;
}

function BookingFlow({ params }: { params: Pick<URLSearchParams, 'get'> }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { draft, set, confirm } = useBooking();
  const [step, setStep] = useState(() => {
    const doc = doctors.find((d) => d.slug === params.get('doctor'));
    if (doc) return params.get('date') && params.get('time') ? 3 : 2;
    return departments.some((d) => d.slug === params.get('department')) ? 1 : 0;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [pending, start] = useTransition();
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  // Pre-fill from the URL (links from doctor pages, departments and AI agents).
  useEffect(() => {
    const doctor = params.get('doctor') ?? '';
    const department = params.get('department') ?? '';
    const date = params.get('date') ?? '';
    const time = params.get('time') ?? '';
    const doc = doctors.find((d) => d.slug === doctor);
    if (doc) set({ doctor: doc.slug, department: doc.department, date, time });
    else if (departments.some((d) => d.slug === department))
      set({ department, doctor: '', date: '', time: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Move focus to the new step's heading so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus();
  }, [step]);

  const doctor = doctors.find((d) => d.slug === draft.doctor);
  const dept = departments.find((d) => d.slug === draft.department);
  const choices = useMemo(
    () => doctors.filter((d) => !draft.department || d.department === draft.department),
    [draft.department],
  );
  const dates = useClinicDates(draft.doctor || undefined);
  const date = draft.date || dates.data?.[0] || '';
  const slots = useSlots(draft.doctor || undefined, date || undefined);

  const go = (n: number) => {
    setFormError('');
    setStep(n);
  };

  const submit = () => {
    setFormError('');
    const parsed = appointmentSchema.safeParse({ ...draft, date: draft.date || date, website: '' });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const i of parsed.error.issues) fe[String(i.path[0])] ??= i.message;
      setErrors(fe);
      if (fe.doctor) return go(1);
      if (fe.date || fe.time) return go(2);
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setErrors({});
    start(async () => {
      try {
        const res = await requestAppointment({ ...parsed.data, website: '' });
        if (res.ok) {
          confirm(res.reference, res.mode === 'demo');
          router.push('/book/confirmed');
        } else {
          setErrors(res.fieldErrors ?? {});
          setFormError(res.error);
          if (res.fieldErrors?.time) go(2);
        }
      } catch {
        setFormError(
          `We could not send your request. Please try again, or call ${site.phones.appointments}.`,
        );
      }
    });
  };

  const panel = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
    exit: reduce ? { opacity: 0 } : { opacity: 0, y: -12, transition: { duration: 0.2 } },
  };

  return (
    <div className="booking">
      <div>
        <ol className="stepper" aria-label="Booking steps">
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === step ? 'step' : undefined} data-done={i < step || undefined}>
              <button type="button" onClick={() => i < step && go(i)} disabled={i > step}>
                <span className="n">{i < step ? <Icon name="check" /> : i + 1}</span>
                {s}
              </button>
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait" initial={false}>
          {step === 0 && (
            <motion.section key="s0" {...panel} aria-labelledby="h0">
              <h2 id="h0" ref={heading} tabIndex={-1} className="b-h">
                Which department do you need?
              </h2>
              <p className="muted">Not sure? Choose General Medicine and a physician will guide you.</p>
              <div className="choice-grid" role="list">
                {departments.map((d) => (
                  <div role="listitem" key={d.slug}>
                    <button
                      type="button"
                      className="choice"
                      aria-pressed={draft.department === d.slug}
                      onClick={() => {
                        set({ department: d.slug, doctor: '', date: '', time: '' });
                        go(1);
                      }}
                    >
                      <span>
                        <b>{d.name}</b>
                        <small>{d.short}</small>
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {step === 1 && (
            <motion.section key="s1" {...panel} aria-labelledby="h1">
              <h2 id="h1" ref={heading} tabIndex={-1} className="b-h">
                Choose a doctor{dept ? ` in ${dept.name}` : ''}
              </h2>
              {choices.length ? (
                <div className="doc-choices">
                  {choices.map((d) => (
                    <button
                      type="button"
                      key={d.slug}
                      className="choice doc-choice"
                      aria-pressed={draft.doctor === d.slug}
                      onClick={() => {
                        set({ doctor: d.slug, department: d.department, date: '', time: '' });
                        go(2);
                      }}
                    >
                      <span className="avatar">
                        <Image
                          src={photos[d.image].src}
                          alt=""
                          fill
                          sizes="64px"
                          style={{ objectFit: 'cover', objectPosition: d.imagePosition ?? '50% 15%' }}
                        />
                      </span>
                      <span>
                        <b>{d.name}</b>
                        <small>
                          {d.role}. {d.languages.join(', ')}.
                        </small>
                        <small className="gold">Next available: {d.nextAvailable}</small>
                      </span>
                      <span className="fee">{formatInr(d.fee)}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="note" style={{ marginTop: 20 }}>
                  This concept site has no sample doctors listed for {dept?.name}. In the full site you would
                  see the whole team here. Call{' '}
                  <a href={tel(site.phones.appointments)}>{site.phones.appointments}</a> or{' '}
                  <button type="button" className="link-btn" onClick={() => go(0)}>
                    choose another department
                  </button>
                  .
                </div>
              )}
              {errors.doctor ? (
                <p className="err" role="alert">
                  {errors.doctor}
                </p>
              ) : null}
            </motion.section>
          )}

          {step === 2 && doctor && (
            <motion.section key="s2" {...panel} aria-labelledby="h2">
              <h2 id="h2" ref={heading} tabIndex={-1} className="b-h">
                Pick a date and time
              </h2>
              <p className="muted">
                {doctor.name} sees patients on {doctor.days.join(', ')}.
              </p>
              <div className="mode" role="radiogroup" aria-label="Type of appointment">
                {(['hospital', 'video'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={draft.mode === m}
                    className="choice"
                    onClick={() => set({ mode: m })}
                  >
                    <Icon name={m === 'hospital' ? 'building' : 'video'} />
                    <span>
                      <b>{m === 'hospital' ? 'At the hospital' : 'Video consultation'}</b>
                      <small>
                        {m === 'hospital'
                          ? `Outpatient clinics, ${site.address.mainEntrance}`
                          : 'A secure link is sent by SMS'}
                      </small>
                    </span>
                  </button>
                ))}
              </div>
              <h3 className="b-sub">Date</h3>
              {dates.isLoading ? <p className="muted">Loading clinic days…</p> : null}
              <div className="dates" role="radiogroup" aria-label="Date">
                {dates.data?.map((d) => {
                  const s = shortDate(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      role="radio"
                      aria-checked={date === d}
                      aria-label={longDate(d)}
                      className="date"
                      onClick={() => set({ date: d, time: '' })}
                    >
                      <small>{s.day}</small>
                      <b>{s.date}</b>
                      <small>{s.month}</small>
                    </button>
                  );
                })}
              </div>
              <h3 className="b-sub">Time on {date ? longDate(date) : '…'}</h3>
              {slots.isLoading ? <p className="muted">Loading times…</p> : null}
              {slots.isError ? (
                <p className="err">
                  Times could not be loaded. Please try again or call {site.phones.appointments}.
                </p>
              ) : null}
              {slots.data ? (
                <div className="slot-grid wide" role="radiogroup" aria-label="Time">
                  {slots.data.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      role="radio"
                      className="slot"
                      aria-checked={draft.time === s.value}
                      disabled={!s.available}
                      aria-label={s.available ? s.time : `${s.time}, taken`}
                      onClick={() => set({ time: s.value, date })}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              ) : null}
              {errors.time ? (
                <p className="err" role="alert">
                  {errors.time}
                </p>
              ) : null}
              <div className="b-acts">
                <button type="button" className="btn btn-blue" disabled={!draft.time} onClick={() => go(3)}>
                  Continue
                </button>
              </div>
            </motion.section>
          )}

          {step === 3 && (
            <motion.section key="s3" {...panel} aria-labelledby="h3">
              <h2 id="h3" ref={heading} tabIndex={-1} className="b-h">
                Who is the appointment for?
              </h2>
              <form
                noValidate
                toolname="enter_patient_details"
                tooldescription="Enter the patient's contact details for the appointment chosen above. The person checks the details and confirms the booking themselves."
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="b-form"
              >
                <div className="who-toggle" role="radiogroup" aria-label="Patient">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={!draft.forSomeoneElse}
                    className="pill"
                    onClick={() => set({ forSomeoneElse: false })}
                  >
                    For me
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={draft.forSomeoneElse}
                    className="pill"
                    onClick={() => set({ forSomeoneElse: true })}
                  >
                    For someone else
                  </button>
                </div>
                <div className="field">
                  <label htmlFor="b-name">{draft.forSomeoneElse ? 'Patient’s full name' : 'Full name'}</label>
                  <input
                    id="b-name"
                    name="name"
                    required
                    className="input"
                    autoComplete="name"
                    value={draft.name}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'e-name' : undefined}
                    onChange={(e) => set({ name: e.target.value })}
                  />
                  {errors.name ? (
                    <p className="err" id="e-name">
                      {errors.name}
                    </p>
                  ) : null}
                </div>
                <div className="cols-2">
                  <div className="field">
                    <label htmlFor="b-phone">Mobile number</label>
                    <input
                      id="b-phone"
                      name="phone"
                      required
                      toolparamdescription="Indian mobile number for the SMS confirmation, for example +91 98470 12345"
                      className="input"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+91"
                      value={draft.phone}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'e-phone' : 'h-phone'}
                      onChange={(e) => set({ phone: e.target.value })}
                    />
                    {errors.phone ? (
                      <p className="err" id="e-phone">
                        {errors.phone}
                      </p>
                    ) : (
                      <p className="hint" id="h-phone">
                        We send your confirmation by SMS.
                      </p>
                    )}
                  </div>
                  <div className="field">
                    <label htmlFor="b-email">
                      Email <span className="muted">(optional)</span>
                    </label>
                    <input
                      id="b-email"
                      name="email"
                      className="input"
                      type="email"
                      autoComplete="email"
                      value={draft.email}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'e-email' : undefined}
                      onChange={(e) => set({ email: e.target.value })}
                    />
                    {errors.email ? (
                      <p className="err" id="e-email">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="b-reason">
                    Reason for the visit <span className="muted">(optional)</span>
                  </label>
                  <textarea
                    id="b-reason"
                    name="reason"
                    className="input"
                    rows={3}
                    maxLength={500}
                    value={draft.reason}
                    aria-describedby="h-reason"
                    onChange={(e) => set({ reason: e.target.value })}
                  />
                  <p className="hint" id="h-reason">
                    A line or two helps the doctor prepare. Please don&apos;t include anything you would not
                    want to share by SMS.
                  </p>
                </div>
                <input
                  type="text"
                  name="website"
                  toolparamdescription="Leave this empty"
                  tabIndex={-1}
                  autoComplete="off"
                  className="sr"
                  aria-hidden="true"
                  defaultValue=""
                />
                <label className="check">
                  <input
                    type="checkbox"
                    name="consent"
                    toolparamdescription="The patient's own agreement to be contacted. Leave unticked so the person can tick it themselves."
                    checked={draft.consent}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? 'e-consent' : undefined}
                    onChange={(e) => set({ consent: e.target.checked })}
                  />
                  <span>
                    I agree that Velune Hospital may contact me about this appointment, as described in the{' '}
                    <a href="/privacy">privacy notice</a>.
                  </span>
                </label>
                {errors.consent ? (
                  <p className="err" id="e-consent">
                    {errors.consent}
                  </p>
                ) : null}
                {formError ? (
                  <p className="note red" role="alert">
                    {formError}
                  </p>
                ) : null}
                <div className="b-acts">
                  <button type="submit" className="btn btn-blue" disabled={pending}>
                    {pending ? 'Booking…' : 'Confirm appointment'}
                  </button>
                  <span className="muted small">You can change or cancel later at no charge.</span>
                </div>
              </form>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <aside className="b-summary" aria-label="Your appointment">
        <h2>Your appointment</h2>
        <dl className="rows">
          <div>
            <dt>Department</dt>
            <dd>
              {dept ? (
                <button type="button" className="link-btn" onClick={() => go(0)}>
                  {dept.name}
                </button>
              ) : (
                '—'
              )}
            </dd>
          </div>
          <div>
            <dt>Doctor</dt>
            <dd>
              {doctor ? (
                <button type="button" className="link-btn" onClick={() => go(1)}>
                  {doctor.name}
                </button>
              ) : (
                '—'
              )}
            </dd>
          </div>
          <div>
            <dt>When</dt>
            <dd>
              {draft.time && (draft.date || date) ? (
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => go(2)}
                >{`${shortDate(draft.date || date).day} ${shortDate(draft.date || date).date} ${shortDate(draft.date || date).month}, ${timeLabel(draft.time)}`}</button>
              ) : (
                '—'
              )}
            </dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{draft.mode === 'video' ? 'Video' : 'At the hospital'}</dd>
          </div>
          <div>
            <dt>Fee</dt>
            <dd>{doctor ? formatInr(doctor.fee) : '—'}</dd>
          </div>
        </dl>
        <p className="small" style={{ marginTop: 14 }}>
          Pay at the hospital or online after booking. Cashless insurance is accepted.
        </p>
        <div className="side-card red" style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 20, color: 'var(--red-text)' }}>Need care now?</h3>
          <p>
            Call <a href={tel(site.phones.emergency)}>{site.phones.emergency}</a> or come to{' '}
            {site.address.erEntrance}.
          </p>
        </div>
      </aside>
    </div>
  );
}
