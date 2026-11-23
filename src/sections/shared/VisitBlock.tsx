import { ButtonLink } from '@/components/ui/Button';
import { site } from '@/content/site';
import { tel } from '@/lib/utils';
import { AreaMap } from './AreaMap';

export const directionsUrl = `https://www.openstreetmap.org/?mlat=${site.geo.latitude}&mlon=${site.geo.longitude}#map=17/${site.geo.latitude}/${site.geo.longitude}`;

export function VisitBlock({ showContact = true }: { showContact?: boolean }) {
  const { address: a, phones: p, hours: h } = site;
  return (
    <section className="section wrap visit" aria-labelledby="visit-title">
      <div className="g12">
        <AreaMap />
        <div className="info">
          <h2 id="visit-title" className="split">
            Visit us
          </h2>
          <p className="body-l" style={{ marginTop: 12 }} data-rise>
            {a.street}, {a.locality}, {a.region} {a.postalCode}
          </p>
          <dl data-lines>
            <div>
              <dt>Appointments</dt>
              <dd>
                <a href={tel(p.appointments)}>{p.appointments}</a>
              </dd>
            </div>
            <div>
              <dt>Emergency</dt>
              <dd>
                <a href={tel(p.emergency)} style={{ color: 'var(--red-text)' }}>
                  {p.emergency}
                </a>
              </dd>
            </div>
            <div>
              <dt>WhatsApp</dt>
              <dd>{p.whatsapp}</dd>
            </div>
            <div>
              <dt>Outpatient clinics</dt>
              <dd>Mon to Sat, 8 am to 8 pm</dd>
            </div>
            <div>
              <dt>Visiting hours</dt>
              <dd>{h.visiting.replace(' and ', ', ')}</dd>
            </div>
          </dl>
          <div className="btns" data-rise>
            <ButtonLink href={directionsUrl} icon="pin" target="_blank" rel="noopener noreferrer">
              Get directions
            </ButtonLink>
            {showContact ? (
              <ButtonLink href="/contact" variant="line">
                Contact us
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
