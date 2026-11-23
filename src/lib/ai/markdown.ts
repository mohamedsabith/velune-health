import { facilities, healthPackages, diagnosticTests, treatments } from '@/content/care';
import { departments } from '@/content/departments';
import { doctors } from '@/content/doctors';
import { articles, faqGroups, jobs, programmes, stories } from '@/content/library';
import { allPages, pages } from '@/content/routes';
import { site } from '@/content/site';
import { formatInr } from '@/lib/utils';

/**
 * Markdown renditions of every page, for AI agents and answer engines. Served at
 * /md/<path> and, through content negotiation in src/proxy.ts, at the page URL
 * itself when a client sends `Accept: text/markdown`.
 */

const list = (items: readonly string[]) => items.map((i) => `- ${i}`).join('\n');
const demo = () => `> Note: ${site.demoNotice}`;

function contactBlock(siteUrl: string) {
  const p = site.phones;
  return [
    '## Contact',
    '',
    `- Emergency (24 hours): ${p.emergency}. Entrance: ${site.address.erEntrance}.`,
    `- Ambulance: ${p.ambulance} (Kerala state ambulance: ${p.stateAmbulance})`,
    `- Appointments: ${p.appointments}, WhatsApp ${p.whatsapp}, or online at ${siteUrl}/book`,
    `- Address: ${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}, India`,
    `- Outpatient hours: ${site.hours.outpatient}. Visiting hours: ${site.hours.visiting}.`,
  ].join('\n');
}

function doctorLine(siteUrl: string, slug: string) {
  const d = doctors.find((x) => x.slug === slug)!;
  return `[${d.name}](${siteUrl}/md/doctors/${d.slug}), ${d.role}. ${d.qualifications}, ${d.years} years. Languages: ${d.languages.join(', ')}. Fee ${formatInr(d.fee)}. Next available: ${d.nextAvailable}.`;
}

function home(siteUrl: string) {
  const f = site.facts;
  return [
    `# ${site.name}, Kochi`,
    '',
    demo(),
    '',
    site.description,
    '',
    `Key facts: ${f.beds} beds (${f.icuBeds} intensive care), ${f.doctors} specialist doctors, ${f.departments} departments, ${f.theatres} operation theatres, ${f.patientsPerYear} patients a year, cashless treatment with ${f.insurers}+ insurers. ${site.accreditations.join('. ')}.`,
    '',
    '## Departments',
    '',
    list(departments.map((d) => `[${d.name}](${siteUrl}/md/departments/${d.slug}): ${d.short}`)),
    '',
    '## Doctors',
    '',
    list(doctors.map((d) => doctorLine(siteUrl, d.slug))),
    '',
    contactBlock(siteUrl),
  ].join('\n');
}

function department(siteUrl: string, slug: string) {
  const d = departments.find((x) => x.slug === slug)!;
  return [
    `# ${d.name} at ${site.name}`,
    '',
    demo(),
    '',
    d.intro,
    '',
    '## Conditions we treat',
    '',
    list(d.conditions),
    '',
    '## Treatments',
    '',
    list(
      d.treatments.map((t) =>
        t.slug ? `[${t.name}](${siteUrl}/md/treatments/${t.slug}): ${t.text}` : `${t.name}: ${t.text}`,
      ),
    ),
    '',
    '## Tests',
    '',
    list(d.tests),
    '',
    '## When to see a doctor',
    '',
    list(d.whenToSee),
    '',
    ...(d.doctors.length ? ['## Doctors', '', list(d.doctors.map((s) => doctorLine(siteUrl, s))), ''] : []),
    '## Questions',
    '',
    ...d.faqs.flatMap((q) => [`### ${q.q}`, '', q.a, '']),
    `Book: ${siteUrl}/book?department=${d.slug}`,
    '',
    contactBlock(siteUrl),
  ].join('\n');
}

function doctor(siteUrl: string, slug: string) {
  const d = doctors.find((x) => x.slug === slug)!;
  const dept = departments.find((x) => x.slug === d.department)!;
  return [
    `# ${d.name}, ${d.role}`,
    '',
    demo(),
    '',
    d.bio,
    '',
    `- Department: [${dept.name}](${siteUrl}/md/departments/${dept.slug})`,
    `- Qualifications: ${d.qualifications}`,
    `- Experience: ${d.years} years`,
    `- Languages: ${d.languages.join(', ')}`,
    `- Consultation fee: ${formatInr(d.fee)}`,
    `- Clinic days: ${d.days.join(', ')}`,
    `- Next available: ${d.nextAvailable}`,
    `- Book: ${siteUrl}/book?doctor=${d.slug}`,
    '',
    '## Special interests',
    '',
    list(d.interests),
    '',
    '## Education',
    '',
    list(d.education),
  ].join('\n');
}

function treatment(siteUrl: string, slug: string) {
  const t = treatments.find((x) => x.slug === slug)!;
  return [
    `# ${t.name}`,
    '',
    demo(),
    '',
    t.summary,
    '',
    '## Who it is for',
    '',
    list(t.forWhom),
    '',
    '## What happens',
    '',
    ...t.steps.flatMap((s) => [`### ${s.title}`, '', s.text, '']),
    `- Hospital stay: ${t.stay}`,
    `- Procedure time: ${t.duration}`,
    `- Recovery: ${t.recovery}`,
    `- Cost: from ${formatInr(t.costFrom)}. ${t.costNote}`,
    '',
    '## Risks',
    '',
    t.risks,
    '',
    ...t.faqs.flatMap((q) => [`### ${q.q}`, '', q.a, '']),
    `Book: ${siteUrl}/book?department=${t.department}`,
  ].join('\n');
}

function article(siteUrl: string, slug: string) {
  const a = articles.find((x) => x.slug === slug)!;
  const r = doctors.find((x) => x.slug === a.reviewer);
  return [
    `# ${a.title}`,
    '',
    `${a.topic}. Reviewed by ${r?.name}, ${r?.role}. Last reviewed ${a.updated}.`,
    '',
    a.summary,
    '',
    ...a.sections.flatMap((s) => [
      `## ${s.heading}`,
      '',
      ...s.body.flatMap((b) => [b, '']),
      ...(s.list ? [list(s.list), ''] : []),
    ]),
    '## When to see a doctor',
    '',
    list(a.seeDoctor),
    '',
    'This article is general information, not a diagnosis. In an emergency call ' +
      site.phones.emergency +
      '.',
  ].join('\n');
}

function simple(siteUrl: string, key: keyof typeof pages, body: string[]) {
  const p = pages[key];
  return [`# ${p.title}`, '', demo(), '', p.description, '', ...body, '', contactBlock(siteUrl)].join('\n');
}

const staticRenderers: Record<string, (siteUrl: string) => string> = {
  '/': home,
  '/departments': (u) =>
    simple(u, 'departments', [
      '## Departments',
      '',
      list(departments.map((d) => `[${d.name}](${u}/md/departments/${d.slug}): ${d.short}`)),
    ]),
  '/doctors': (u) =>
    simple(u, 'doctors', [
      '## Doctors',
      '',
      list(doctors.map((d) => doctorLine(u, d.slug))),
      '',
      `Machine-readable list: ${u}/doctors.json`,
    ]),
  '/book': (u) =>
    simple(u, 'book', [
      'Book online in four steps: choose a department, choose a doctor, choose a date and time, then enter the patient’s name, phone number and reason for the visit. You receive a reference number straight away.',
      '',
      `Pre-fill the form with query parameters: ${u}/book?doctor=<slug>&date=YYYY-MM-DD&time=HH:MM. Free times: ${u}/api/availability?doctor=<slug>&date=YYYY-MM-DD`,
    ]),
  '/facilities': (u) =>
    simple(
      u,
      'facilities',
      facilities.flatMap((f) => [`## ${f.name}`, '', f.line, f.text, '', list(f.points), '']),
    ),
  '/emergency': (u) =>
    simple(u, 'emergency', [
      `If someone's life is in danger, call ${site.phones.emergency} or come straight to ${site.address.erEntrance}. Treatment always starts before paperwork or payment. Typical wait to be seen: about ${site.facts.erWaitMinutes} minutes.`,
      '',
      'Come in for chest pain, signs of stroke, severe breathlessness, heavy bleeding, serious injury, or a very unwell child.',
    ]),
  '/health-packages': (u) =>
    simple(
      u,
      'packages',
      healthPackages.flatMap((p) => [
        `## ${p.name} (${formatInr(p.price)})`,
        '',
        `For: ${p.forWhom}. Takes about ${p.time}.`,
        '',
        list(p.tests),
        '',
      ]),
    ),
  '/diagnostics': (u) =>
    simple(u, 'diagnostics', [
      '| Test | Preparation | Results | Price |',
      '| --- | --- | --- | --- |',
      ...diagnosticTests.map((t) => `| ${t.name} | ${t.prep} | ${t.results} | ${formatInr(t.price)} |`),
    ]),
  '/faq': (u) =>
    simple(
      u,
      'faq',
      faqGroups.flatMap((g) => [`## ${g.title}`, '', ...g.items.flatMap((i) => [`### ${i.q}`, '', i.a, ''])]),
    ),
  '/stories': (u) =>
    simple(u, 'stories', [
      'Sample stories written for this concept website.',
      '',
      ...stories.map((s) => `> “${s.quote}” ${s.who}, ${s.detail}\n`),
    ]),
  '/careers': (u) =>
    simple(u, 'careers', [
      '## Open roles',
      '',
      list(jobs.map((j) => `${j.title} (${j.team}, ${j.type}): ${j.experience}`)),
    ]),
  '/education': (u) =>
    simple(
      u,
      'education',
      programmes.flatMap((p) => [`## ${p.name}`, '', `${p.length}, ${p.seats}. ${p.text}`, '']),
    ),
  '/health-library': (u) =>
    simple(u, 'library', [
      list(articles.map((a) => `[${a.title}](${u}/md/health-library/${a.slug}): ${a.summary}`)),
    ]),
};

/** Markdown for any page path, or null if the path is unknown. */
export function markdownFor(path: string, siteUrl: string): string | null {
  const clean = path === '' ? '/' : path.replace(/\/+$/, '') || '/';
  if (staticRenderers[clean]) return staticRenderers[clean](siteUrl);
  const [, section, slug] = clean.split('/');
  if (section === 'departments' && slug && departments.some((d) => d.slug === slug))
    return department(siteUrl, slug);
  if (section === 'doctors' && slug && doctors.some((d) => d.slug === slug)) return doctor(siteUrl, slug);
  if (section === 'treatments' && slug && treatments.some((t) => t.slug === slug))
    return treatment(siteUrl, slug);
  if (section === 'health-library' && slug && articles.some((a) => a.slug === slug))
    return article(siteUrl, slug);
  const key = (Object.keys(pages) as (keyof typeof pages)[]).find((k) => pages[k].path === clean);
  if (key && !('noindex' in pages[key])) return simple(siteUrl, key, []);
  return null;
}

/** Every path that has a Markdown rendition. */
export function markdownPaths(): string[] {
  return allPages()
    .filter((p) => !p.noindex)
    .map((p) => p.path);
}
