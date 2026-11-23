import { departments } from '@/content/departments';
import { doctors } from '@/content/doctors';
import { env } from '@/lib/env/server';

export const dynamic = 'force-static';

/** Machine-readable doctor directory for agents and integrations. */
export function GET() {
  const data = doctors.map((d) => ({
    slug: d.slug,
    name: d.name,
    role: d.role,
    department: departments.find((x) => x.slug === d.department)?.name,
    qualifications: d.qualifications,
    yearsOfExperience: d.years,
    languages: d.languages,
    consultationFeeInr: d.fee,
    clinicDays: d.days,
    profileUrl: `${env.siteUrl}/doctors/${d.slug}`,
    bookingUrl: `${env.siteUrl}/book?doctor=${d.slug}`,
  }));
  return Response.json({ note: 'Concept website: placeholder doctors.', doctors: data });
}
