import { departments } from '@/content/departments';
import { doctors } from '@/content/doctors';
import { allPages } from '@/content/routes';
import { site } from '@/content/site';
import { markdownFor, markdownPaths } from './markdown';

/**
 * llms.txt (https://llmstxt.org): an H1, a blockquote summary, then sections of
 * annotated links to Markdown renditions.
 */
export function renderLlmsTxt(siteUrl: string): string {
  const f = site.facts;
  const md = (path: string) => `${siteUrl}${path === '/' ? '/md' : `/md${path}`}`;
  const pages = allPages().filter((p) => !p.noindex);
  const main = pages.filter((p) => !/^\/(departments|doctors|treatments|health-library)\/./.test(p.path));
  return [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `Important: ${site.demoNotice}`,
    '',
    `Key facts: ${f.beds} beds, ${f.icuBeds} intensive care beds, ${f.doctors} doctors, ${f.departments} departments, emergency open 24 hours at ${site.address.erEntrance}. Emergency phone ${site.phones.emergency}. Appointments ${site.phones.appointments}.`,
    `Address: ${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}, India.`,
    '',
    '## Pages',
    '',
    ...main.map((p) => `- [${p.label}](${md(p.path)}): ${p.description}`),
    '',
    '## Departments',
    '',
    ...departments.map((d) => `- [${d.name}](${md(`/departments/${d.slug}`)}): ${d.short}`),
    '',
    '## Doctors',
    '',
    ...doctors.map(
      (d) => `- [${d.name}](${md(`/doctors/${d.slug}`)}): ${d.role}. Languages: ${d.languages.join(', ')}.`,
    ),
    '',
    '## Data and tools',
    '',
    `- [Doctors (JSON)](${siteUrl}/doctors.json): every doctor with department, languages, fee, clinic days and booking URL`,
    `- [Appointment availability](${siteUrl}/api/availability?doctor=meera-k&date=YYYY-MM-DD): free times for a doctor on a date (JSON)`,
    `- [OpenAPI description](${siteUrl}/openapi.json): the two read-only endpoints above`,
    `- [Agent resource manifest](${siteUrl}/.well-known/ard.json): Agentic Resource Discovery entries for the directory and API`,
    `- WebMCP tools in the page: search_doctors, list_departments, get_available_slots, start_appointment_booking, get_emergency_information`,
    `- [Full content](${siteUrl}/llms-full.txt): every page as Markdown`,
    `- [Sitemap](${siteUrl}/sitemap.xml)`,
    '',
    '## Optional',
    '',
    `- [Booking](${siteUrl}/book): a person confirms every appointment in the web form; there is no public write API.`,
    '',
  ].join('\n');
}

export function renderLlmsFullTxt(siteUrl: string): string {
  return [renderLlmsTxt(siteUrl), ...markdownPaths().map((p) => `\n---\n\n${markdownFor(p, siteUrl)}`)].join(
    '\n',
  );
}
