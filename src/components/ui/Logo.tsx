import Link from 'next/link';
import { site } from '@/content/site';

/** The Velune mark: a royal-blue tile with a white V and a gold plus. */
export function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="#1E3A8A" />
      <path
        d="M9.2 11.5l6.8 13 6.8-13"
        fill="none"
        stroke="#fff"
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
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link className="logo" href="/" style={light ? { color: '#fff' } : undefined}>
      <LogoMark />
      <span>
        <b>{site.name}</b>
        <small style={light ? { color: '#B9C3DA' } : undefined}>Kochi, Kerala</small>
      </span>
    </Link>
  );
}
