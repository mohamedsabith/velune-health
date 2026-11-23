import { describe, expect, it } from 'vitest';
import { treatments } from '@/content/care';
import { departments } from '@/content/departments';
import { doctors } from '@/content/doctors';
import { articles } from '@/content/library';
import { allPages } from '@/content/routes';

describe('content integrity', () => {
  it('has unique page paths', () => {
    const paths = allPages().map((p) => p.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('links every doctor, treatment and article to a real department', () => {
    const slugs = new Set(departments.map((d) => d.slug));
    for (const d of doctors) expect(slugs.has(d.department)).toBe(true);
    for (const t of treatments) expect(slugs.has(t.department)).toBe(true);
    for (const a of articles) expect(slugs.has(a.department)).toBe(true);
  });

  it('only lists department doctors that exist', () => {
    const known = new Set(doctors.map((d) => d.slug));
    for (const d of departments) for (const s of d.doctors) expect(known.has(s)).toBe(true);
  });

  it('has an article reviewer for every article', () => {
    for (const a of articles) expect(doctors.some((d) => d.slug === a.reviewer)).toBe(true);
  });

  it('keeps page titles and descriptions within search-friendly lengths', () => {
    for (const p of allPages()) {
      expect(p.title.length, p.path).toBeLessThanOrEqual(90);
      expect(p.description.length, p.path).toBeLessThanOrEqual(260);
    }
  });
});
