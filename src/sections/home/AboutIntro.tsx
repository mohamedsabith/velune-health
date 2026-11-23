import { MoreLink } from '@/components/ui/Button';
import { Picture } from '@/components/ui/Picture';
import { Count } from '@/components/motion/Count';
import { site } from '@/content/site';

export function AboutIntro() {
  return (
    <section id="about" className="section wrap" aria-labelledby="about-title">
      <div className="g12 about">
        <h2 id="about-title" className="h2 split">
          Kochi&apos;s riverside hospital, caring for families since {site.founded}.
        </h2>
        <div className="txt">
          <p className="body-l" data-rise>
            Velune began as a 40-bed clinic beside the Periyar. Today we are a {site.facts.beds}-bed hospital
            with a 24-hour emergency department, eight operation theatres and our own laboratory. What
            hasn&apos;t changed is the time our doctors give each patient.
          </p>
          <dl className="figs" data-rise>
            <div>
              <dt>
                <Count to={String(site.facts.beds)} />
              </dt>
              <dd>beds, {site.facts.icuBeds} in intensive care</dd>
            </div>
            <div>
              <dt>
                <Count to={String(site.facts.doctors)} />+
              </dt>
              <dd>specialist doctors</dd>
            </div>
            <div>
              <dt>
                <Count to={String(site.facts.departments)} />
              </dt>
              <dd>departments</dd>
            </div>
            <div>
              <dt>{site.facts.patientsPerYear}</dt>
              <dd>patients each year</dd>
            </div>
          </dl>
          <p style={{ marginTop: 28 }} data-rise>
            <MoreLink href="/about">About Velune</MoreLink>
          </p>
        </div>
      </div>
      <div className="g12 pics">
        <Picture
          image="exterior"
          className="a"
          sizes="(max-width: 980px) 100vw, 40vw"
          position="40% 50%"
          reveal
          caption="Riverside Avenue, Kochi"
        />
        <Picture
          image="lobby"
          className="b"
          sizes="(max-width: 980px) 100vw, 58vw"
          reveal
          caption="Main reception, Gate 1"
        />
      </div>
    </section>
  );
}
