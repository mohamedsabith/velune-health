import localFont from 'next/font/local';

/** Self-hosted (SIL Open Font License): no request to Google Fonts at build or run time. */
export const newsreader = localFont({
  variable: '--font-newsreader',
  display: 'swap',
  preload: true,
  fallback: ['Iowan Old Style', 'Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
  src: [
    { path: '../fonts/newsreader-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/newsreader-latin-500-normal.woff2', weight: '500', style: 'normal' },
  ],
});

export const figtree = localFont({
  variable: '--font-figtree',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'Segoe UI', 'sans-serif'],
  adjustFontFallback: 'Arial',
  src: [
    { path: '../fonts/figtree-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/figtree-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/figtree-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/figtree-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
});
