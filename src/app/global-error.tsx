'use client';

/** Last-resort boundary (root layout failed): no shared components, inline styles only. */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#F3F5FA',
          color: '#2A3550',
          fontFamily: 'Georgia, serif',
        }}
      >
        <main style={{ maxWidth: 520, padding: 32 }}>
          <p style={{ fontSize: 14, color: '#1E3A8A', fontFamily: 'system-ui, sans-serif', fontWeight: 600 }}>
            Velune Hospital
          </p>
          <h1 style={{ color: '#0D1838', fontWeight: 400, fontSize: 40, margin: '16px 0' }}>
            The site is temporarily unavailable.
          </h1>
          <p style={{ fontFamily: 'system-ui, sans-serif' }}>In an emergency, call +91 484 000 2112.</p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 16,
              background: '#1E3A8A',
              color: '#fff',
              border: 0,
              borderRadius: 8,
              padding: '14px 24px',
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
