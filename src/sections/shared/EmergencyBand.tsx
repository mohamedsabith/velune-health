import { ButtonLink } from '@/components/ui/Button';
import { site } from '@/content/site';
import { tel } from '@/lib/utils';

export function EmergencyBand({ as: H = 'h2' }: { as?: 'h1' | 'h2' }) {
  const { phones: p, address: a } = site;
  return (
    <section id="emergency" className="section" aria-labelledby="er-title">
      <div className="er-band">
        <div className="wrap g12">
          <H id="er-title" className="h2 split">
            Emergency and trauma care, open every hour of every day.
          </H>
          <p className="er-txt" data-rise>
            If someone&apos;s life is in danger, call us or come straight to {a.erEntrance}. Treatment always
            starts before any paperwork or payment.
          </p>
          <div className="er-calls" data-rise>
            <ButtonLink href={tel(p.emergency)} variant="red" icon="phone">
              {`Call ${p.emergency}`}
            </ButtonLink>
            <ButtonLink href={tel(p.ambulance)} variant="white" icon="amb">
              {`Ambulance ${p.ambulance}`}
            </ButtonLink>
          </div>
          <dl className="er-panel" data-lines>
            <div>
              <dt>Status</dt>
              <dd className="open">Open now</dd>
            </div>
            <div>
              <dt>Wait to be seen</dt>
              <dd>About {site.facts.erWaitMinutes} minutes</dd>
            </div>
            <div>
              <dt>Entrance</dt>
              <dd>{a.erEntrance}</dd>
            </div>
            <div>
              <dt>Cath lab, stroke and trauma teams</dt>
              <dd>On call 24 hours</dd>
            </div>
            <div>
              <dt>Free ambulance (Kerala)</dt>
              <dd>{p.stateAmbulance}</dd>
            </div>
          </dl>
          <p className="signs" data-rise>
            Come in for chest pain, signs of stroke, severe breathlessness, heavy bleeding, serious injury, or
            a very unwell child.
          </p>
        </div>
      </div>
    </section>
  );
}
