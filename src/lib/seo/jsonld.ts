import type { Department } from '@/content/departments';
import type { Doctor } from '@/content/doctors';
import type { Article } from '@/content/library';
import type { Treatment } from '@/content/care';
import { site } from '@/content/site';

const id = (siteUrl: string, frag: string) => `${siteUrl}/#${frag}`;

/** The hospital itself (schema.org Hospital, a MedicalOrganization and a place). */
export function hospitalJsonLd(siteUrl: string) {
  const a = site.address;
  return {
    '@context': 'https://schema.org',
    '@type': ['Hospital', 'MedicalOrganization'],
    '@id': id(siteUrl, 'hospital'),
    name: site.name,
    description: site.description,
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    image: `${siteUrl}/opengraph-image`,
    telephone: site.phones.appointments,
    email: site.email,
    foundingDate: String(site.founded),
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.locality,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.latitude, longitude: site.geo.longitude },
    openingHoursSpecification: site.openingHoursSpec.map((o) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: o.days,
      opens: o.opens,
      closes: o.closes,
    })),
    availableService: [{ '@type': 'MedicalProcedure', name: 'Emergency care, 24 hours' }],
    medicalSpecialty: [
      'Cardiovascular',
      'Neurologic',
      'Musculoskeletal',
      'Pediatric',
      'Obstetric',
      'Oncologic',
      'PrimaryCare',
      'Gastroenterologic',
      'Dermatologic',
      'Dentistry',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'emergency',
        telephone: site.phones.emergency,
        availableLanguage: site.languages,
        hoursAvailable: '24/7',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'appointments',
        telephone: site.phones.appointments,
        availableLanguage: site.languages,
      },
    ],
    isAcceptingNewPatients: true,
    potentialAction: { '@type': 'ReserveAction', target: `${siteUrl}/book`, name: 'Book an appointment' },
  };
}

export function websiteJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': id(siteUrl, 'website'),
    name: site.name,
    url: siteUrl,
    inLanguage: 'en-IN',
    publisher: { '@id': id(siteUrl, 'hospital') },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/doctors?q={query}`,
      'query-input': 'required name=query',
    },
  };
}

export function breadcrumbJsonLd(siteUrl: string, trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${siteUrl}${t.path}`,
    })),
  };
}

export function departmentJsonLd(siteUrl: string, d: Department) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: `${d.name} at ${site.name}`,
    url: `${siteUrl}/departments/${d.slug}`,
    about: { '@type': 'MedicalSpecialty', name: d.specialty },
    specialty: d.specialty,
    publisher: { '@id': id(siteUrl, 'hospital') },
    mainEntity: {
      '@type': 'MedicalClinic',
      name: `${d.name}, ${site.name}`,
      medicalSpecialty: d.specialty,
      parentOrganization: { '@id': id(siteUrl, 'hospital') },
      availableService: d.treatments.map((t) => ({
        '@type': 'MedicalProcedure',
        name: t.name,
        description: t.text,
      })),
    },
  };
}

export function doctorJsonLd(siteUrl: string, d: Doctor, departmentName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: d.name,
    url: `${siteUrl}/doctors/${d.slug}`,
    image: undefined,
    description: d.bio,
    jobTitle: d.role,
    medicalSpecialty: departmentName,
    knowsLanguage: d.languages,
    hospitalAffiliation: { '@id': id(siteUrl, 'hospital') },
    worksFor: { '@id': id(siteUrl, 'hospital') },
    isAcceptingNewPatients: true,
    priceRange: `₹${d.fee}`,
    potentialAction: {
      '@type': 'ReserveAction',
      target: `${siteUrl}/book?doctor=${d.slug}`,
      name: `Book with ${d.name}`,
    },
  };
}

export function treatmentJsonLd(siteUrl: string, t: Treatment) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: t.name,
    url: `${siteUrl}/treatments/${t.slug}`,
    about: {
      '@type': 'MedicalProcedure',
      name: t.name,
      description: t.summary,
      howPerformed: t.steps.map((s) => `${s.title}: ${s.text}`).join(' '),
    },
    publisher: { '@id': id(siteUrl, 'hospital') },
  };
}

export function articleJsonLd(siteUrl: string, a: Article, reviewer?: Doctor) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: a.title,
    description: a.summary,
    url: `${siteUrl}/health-library/${a.slug}`,
    datePublished: a.published,
    dateModified: a.updated,
    lastReviewed: a.updated,
    reviewedBy: reviewer
      ? { '@type': 'Physician', name: reviewer.name, url: `${siteUrl}/doctors/${reviewer.slug}` }
      : undefined,
    publisher: { '@id': id(siteUrl, 'hospital') },
    audience: { '@type': 'PeopleAudience', audienceType: 'Patient' },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
