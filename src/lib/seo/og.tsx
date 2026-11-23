import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

const fontDir = join(process.cwd(), 'src/assets/og-fonts');

/** Branded social card rendered at build time (Satori) with the site's own typefaces. */
export async function renderOgImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  const [serif, sans] = await Promise.all([
    readFile(join(fontDir, 'newsreader-latin-500-normal.woff')),
    readFile(join(fontDir, 'figtree-latin-600-normal.woff')),
  ]);
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#1E3A8A',
        color: '#fff',
        padding: '72px 84px',
        fontFamily: 'Newsreader',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        <svg width="64" height="64" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="8" fill="#fff" />
          <path
            d="M9.2 11.5l6.8 13 6.8-13"
            fill="none"
            stroke="#1E3A8A"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 5.6v6.2M12.9 8.7h6.2"
            fill="none"
            stroke="#E0B45A"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 40 }}>Velune Hospital</div>
          <div style={{ fontFamily: 'Figtree', fontSize: 20, color: '#C9D2E6' }}>Kochi, Kerala</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: 'Figtree', fontSize: 24, color: '#E0B45A', marginBottom: 22 }}>
          {eyebrow}
        </div>
        <div style={{ fontSize: 76, lineHeight: 1.04, maxWidth: 980, letterSpacing: '-0.02em' }}>{title}</div>
      </div>
      <div style={{ display: 'flex', fontFamily: 'Figtree', fontSize: 22, color: '#C9D2E6' }}>
        Emergency 24 hours: Gate 2, Market Road
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: 'Newsreader', data: serif, weight: 500, style: 'normal' },
        { name: 'Figtree', data: sans, weight: 600, style: 'normal' },
      ],
    },
  );
}
