import { MoreLink } from '@/components/ui/Button';
import { stories } from '@/content/library';

export function StoriesBlock() {
  const [main, ...rest] = stories;
  return (
    <section className="section wrap stories" aria-labelledby="st-title">
      <h2 id="st-title" className="sr">
        Patient stories
      </h2>
      <div className="g12">
        <figure className="big" style={{ margin: 0 }}>
          <blockquote className="lit">“{main!.quote}”</blockquote>
          <figcaption className="who">
            <b>{main!.who}.</b> {main!.detail}
          </figcaption>
          <p style={{ marginTop: 28 }}>
            <MoreLink href="/stories">Read patient stories</MoreLink>
          </p>
        </figure>
        <div className="side" data-rise>
          {rest.slice(0, 2).map((s) => (
            <figure key={s.quote}>
              <blockquote>“{s.quote}”</blockquote>
              <figcaption>
                {s.who}. {s.detail}
              </figcaption>
            </figure>
          ))}
          <p className="small" style={{ marginTop: 14 }}>
            Sample stories written for this concept website.
          </p>
        </div>
      </div>
    </section>
  );
}
