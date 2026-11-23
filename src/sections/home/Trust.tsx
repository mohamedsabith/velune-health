import { Icon } from '@/components/ui/Icon';
import { site } from '@/content/site';

export function Trust() {
  return (
    <section className="trust" aria-label="Accreditation and services">
      <div className="wrap">
        <ul>
          <li data-rise>
            <Icon name="badge" size={22} className="text-gold-text" />
            <span>
              <b>NABH</b> accredited hospital
            </span>
          </li>
          <li data-rise>
            <span>
              <b>NABL</b> accredited laboratory
            </span>
          </li>
          <li data-rise>
            <span>
              <b>{site.facts.insurers}+</b> insurers, cashless
            </span>
          </li>
          <li data-rise>
            <span>
              <b>24 h</b> emergency and trauma care
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
