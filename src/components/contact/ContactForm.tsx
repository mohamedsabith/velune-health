'use client';

import { useState, useTransition } from 'react';
import { sendMessage, type ContactInput } from '@/lib/contact/actions';

const TOPICS = [
  'Appointments',
  'Bills and insurance',
  'Reports and records',
  'Feedback or complaint',
  'Something else',
] as const;

export function ContactForm() {
  const [v, setV] = useState<ContactInput>({
    name: '',
    contact: '',
    topic: 'Appointments',
    message: '',
    website: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const [pending, start] = useTransition();

  if (status === 'sent')
    return (
      <div className="note gold" role="status">
        <b>Thank you, {v.name.split(' ')[0]}.</b> We reply within one working day. For anything urgent, please
        call +91 484 000 2400.
      </div>
    );

  return (
    <form
      className="b-form"
      noValidate
      toolname="send_message_to_hospital"
      tooldescription="Write a non-urgent message to the Velune Hospital help desk. The person reviews and sends it. Never use this for emergencies; call +91 484 000 2112 instead."
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          try {
            const res = await sendMessage(v);
            if (res.ok) setStatus('sent');
            else {
              setErrors(res.fieldErrors ?? {});
              setError(res.error);
            }
          } catch {
            setError('We could not send your message. Please try again or call +91 484 000 2400.');
          }
        });
      }}
    >
      <div className="cols-2">
        <div className="field">
          <label htmlFor="c-name">Your name</label>
          <input
            id="c-name"
            name="name"
            required
            className="input"
            autoComplete="name"
            value={v.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'ce-name' : undefined}
            onChange={(e) => setV({ ...v, name: e.target.value })}
          />
          {errors.name ? (
            <p className="err" id="ce-name">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="field">
          <label htmlFor="c-contact">Phone or email</label>
          <input
            id="c-contact"
            name="contact"
            required
            toolparamdescription="A phone number or email address the hospital can reply to"
            className="input"
            autoComplete="email"
            value={v.contact}
            aria-invalid={Boolean(errors.contact)}
            aria-describedby={errors.contact ? 'ce-contact' : undefined}
            onChange={(e) => setV({ ...v, contact: e.target.value })}
          />
          {errors.contact ? (
            <p className="err" id="ce-contact">
              {errors.contact}
            </p>
          ) : null}
        </div>
      </div>
      <div className="field">
        <label htmlFor="c-topic">What is it about?</label>
        <select
          id="c-topic"
          name="topic"
          className="input"
          value={v.topic}
          onChange={(e) => setV({ ...v, topic: e.target.value as ContactInput['topic'] })}
        >
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="c-msg">Message</label>
        <textarea
          id="c-msg"
          name="message"
          required
          className="input"
          rows={5}
          value={v.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'ce-msg' : 'ch-msg'}
          onChange={(e) => setV({ ...v, message: e.target.value })}
        />
        {errors.message ? (
          <p className="err" id="ce-msg">
            {errors.message}
          </p>
        ) : (
          <p className="hint" id="ch-msg">
            Please don&apos;t include detailed medical information in this form.
          </p>
        )}
      </div>
      <input
        type="text"
        name="website"
        toolparamdescription="Leave this empty"
        tabIndex={-1}
        autoComplete="off"
        className="sr"
        aria-hidden="true"
        value={v.website}
        onChange={(e) => setV({ ...v, website: e.target.value })}
      />
      {error ? (
        <p className="note red" role="alert">
          {error}
        </p>
      ) : null}
      <div>
        <button className="btn btn-blue" type="submit" disabled={pending}>
          {pending ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </form>
  );
}
