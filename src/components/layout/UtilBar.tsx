import Link from 'next/link';
import { site } from '@/content/site';
import { tel } from '@/lib/utils';

export function UtilBar() {
  return (
    <div className="util">
      <div className="wrap">
        <div className="util-l">
          <a className="er" href={tel(site.phones.emergency)}>
            <i aria-hidden="true" />
            Emergency 24/7: {site.phones.emergency}
          </a>
          <span className="sep" aria-hidden="true" />
          <a href={tel(site.phones.ambulance)}>Ambulance {site.phones.ambulance}</a>
        </div>
        <nav className="util-r" aria-label="Quick links">
          <Link href="/diagnostics">Lab reports</Link>
          <Link href="/insurance">Pay a bill</Link>
          <Link href="/contact">International patients</Link>
          <Link href="/careers">Careers</Link>
        </nav>
      </div>
    </div>
  );
}
