'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { departments } from '@/content/departments';
import { doctors } from '@/content/doctors';

const LANGS = ['English', 'Malayalam', 'Hindi', 'Tamil', 'Arabic', 'Kannada', 'Urdu'];

/**
 * Search and filter the doctor directory. Every card is rendered on the server
 * (so search engines and agents see them all); this component only hides the
 * cards that don't match, and keeps the search in the URL so it can be shared.
 */
export function DoctorFinder({ cards }: { cards: Record<string, ReactNode> }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [dept, setDept] = useState(params.get('department') ?? '');
  const [lang, setLang] = useState(params.get('language') ?? '');
  const [today, setToday] = useState(params.get('today') === '1');

  const sync = (next: Record<string, string>) => {
    const u = new URLSearchParams();
    const all = { q, department: dept, language: lang, today: today ? '1' : '', ...next };
    Object.entries(all).forEach(([k, v]) => v && u.set(k, v));
    router.replace(`${pathname}${u.size ? `?${u}` : ''}` as never, { scroll: false });
  };

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return doctors.filter((d) => {
      const dep = departments.find((x) => x.slug === d.department);
      const hay = [d.name, d.role, dep?.name, ...(dep?.conditions ?? []), ...d.interests]
        .join(' ')
        .toLowerCase();
      return (
        (!needle || hay.includes(needle)) &&
        (!dept || d.department === dept) &&
        (!lang || d.languages.includes(lang)) &&
        (!today || d.nextAvailable.startsWith('Today'))
      );
    });
  }, [q, dept, lang, today]);

  const clear = () => {
    setQ('');
    setDept('');
    setLang('');
    setToday(false);
    router.replace(pathname as never, { scroll: false });
  };

  return (
    <>
      <form
        className="finder"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          sync({});
        }}
        aria-label="Search doctors"
        toolname="filter_doctors"
        tooldescription="Filter the list of Velune Hospital doctors shown on this page."
      >
        <div className="field finder-q">
          <label htmlFor="find-q">Name, department or condition</label>
          <div className="input-icon">
            <Icon name="search" />
            <input
              id="find-q"
              name="q"
              toolparamdescription="A doctor's name, department or condition, for example knee pain"
              className="input"
              type="search"
              value={q}
              placeholder="For example: knee pain, Dr. Meera"
              onChange={(e) => setQ(e.target.value)}
              onBlur={() => sync({ q })}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="find-d">Department</label>
          <select
            id="find-d"
            name="department"
            className="input"
            value={dept}
            onChange={(e) => {
              setDept(e.target.value);
              sync({ department: e.target.value });
            }}
          >
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="find-l">Speaks</label>
          <select
            id="find-l"
            name="language"
            className="input"
            value={lang}
            onChange={(e) => {
              setLang(e.target.value);
              sync({ language: e.target.value });
            }}
          >
            <option value="">Any language</option>
            {LANGS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
        <label className="check finder-today">
          <input
            type="checkbox"
            name="today"
            checked={today}
            onChange={(e) => {
              setToday(e.target.checked);
              sync({ today: e.target.checked ? '1' : '' });
            }}
          />
          Available today
        </label>
      </form>
      <p className="doc-count small" aria-live="polite">
        {shown.length === doctors.length
          ? `Showing all ${shown.length} doctors`
          : `${shown.length} of ${doctors.length} doctors match`}
      </p>
      {shown.length ? (
        <div className="g12 docs">
          {shown.map((d) => (
            <div key={d.slug} className="doc-cell">
              {cards[d.slug]}
            </div>
          ))}
        </div>
      ) : (
        <div className="note" style={{ marginTop: 28 }}>
          No doctors match those filters.{' '}
          <button type="button" className="link-btn" onClick={clear}>
            Clear all filters
          </button>{' '}
          or call our care team on +91 484 000 2000 and a nurse will help you choose.
        </div>
      )}
    </>
  );
}
