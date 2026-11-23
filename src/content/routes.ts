import { articles } from './library';
import { departments } from './departments';
import { doctors } from './doctors';
import { treatments } from './care';

export interface PageInfo {
  path: string;
  title: string;
  description: string;
  /** Short label for navigation, breadcrumbs and llms.txt. */
  label: string;
  /** Leave out of the sitemap and search results (e.g. the booking confirmation). */
  noindex?: boolean;
  priority?: number;
}

/** Every fixed page on the site. Dynamic pages (departments, doctors, treatments, articles) are listed by `allPages()`. */
export const pages = {
  home: {
    path: '/',
    label: 'Home',
    priority: 1,
    title: 'Velune Hospital, Kochi: multi-speciality hospital with 24-hour emergency care',
    description:
      'Velune Hospital is a 250-bed multi-speciality hospital in Kochi, Kerala. Book an appointment with 120 specialists in 32 departments, or come to our 24-hour emergency department at Gate 2.',
  },
  about: {
    path: '/about',
    label: 'About us',
    priority: 0.7,
    title: 'About Velune Hospital',
    description:
      'How Velune grew from a 40-bed clinic beside the Periyar into a 250-bed multi-speciality hospital, and the promises we make to every patient.',
  },
  departments: {
    path: '/departments',
    label: 'Departments',
    priority: 0.9,
    title: 'Departments and specialities',
    description:
      'Cardiology, neurology, orthopaedics, paediatrics, obstetrics, oncology and more: what each department treats and how to book.',
  },
  doctors: {
    path: '/doctors',
    label: 'Find a doctor',
    priority: 0.9,
    title: 'Find a doctor',
    description:
      'Search Velune Hospital doctors by name, department and language, see who is available today, and book directly.',
  },
  book: {
    path: '/book',
    label: 'Book an appointment',
    priority: 0.9,
    title: 'Book an appointment',
    description:
      'Book a hospital or video appointment with a Velune Hospital specialist in about two minutes.',
  },
  bookConfirmed: {
    path: '/book/confirmed',
    label: 'Appointment confirmed',
    noindex: true,
    title: 'Appointment confirmed',
    description: 'Your Velune Hospital appointment is confirmed.',
  },
  facilities: {
    path: '/facilities',
    label: 'Facilities',
    priority: 0.6,
    title: 'Facilities: theatres, intensive care, imaging and rooms',
    description:
      'Eight operation theatres, 50 intensive care beds, 3T MRI, a 24-hour laboratory and pharmacy, and private rooms with a bed for family.',
  },
  emergency: {
    path: '/emergency',
    label: 'Emergency',
    priority: 0.9,
    title: 'Emergency and trauma care, open 24 hours',
    description:
      'Velune Hospital emergency department is open 24 hours at Gate 2, Market Road, Kochi. Call +91 484 000 2112. Ambulance +91 484 000 2108.',
  },
  patients: {
    path: '/patients',
    label: 'Patients and visitors',
    priority: 0.7,
    title: 'Patients and visitors',
    description:
      'Everything you need before you come in: what to bring, admission and discharge, visiting hours, parking, reports and your rights as a patient.',
  },
  stories: {
    path: '/stories',
    label: 'Patient stories',
    priority: 0.5,
    title: 'Patient stories',
    description: 'Sample stories from patients and families cared for at Velune Hospital.',
  },
  library: {
    path: '/health-library',
    label: 'Health library',
    priority: 0.7,
    title: 'Health library',
    description: 'Clear health advice written for patients and reviewed by Velune Hospital doctors.',
  },
  contact: {
    path: '/contact',
    label: 'Contact us',
    priority: 0.7,
    title: 'Contact us and how to find us',
    description:
      'Phone numbers, WhatsApp, email and directions to Velune Hospital, 12 Riverside Avenue, Kochi.',
  },
  packages: {
    path: '/health-packages',
    label: 'Health checks',
    priority: 0.7,
    title: 'Health check packages',
    description:
      'Preventive health check packages for every age, from ₹2,400, with results and a doctor consultation on the same day.',
  },
  diagnostics: {
    path: '/diagnostics',
    label: 'Lab and imaging',
    priority: 0.6,
    title: 'Laboratory and imaging tests',
    description:
      'Blood tests, MRI, CT, ultrasound and heart tests at Velune Hospital: how to prepare, when results arrive and prices.',
  },
  insurance: {
    path: '/insurance',
    label: 'Insurance and billing',
    priority: 0.6,
    title: 'Insurance, cashless treatment and billing',
    description:
      'Cashless treatment with more than 40 insurers, written estimates before planned procedures, and how to pay.',
  },
  careers: {
    path: '/careers',
    label: 'Careers',
    priority: 0.4,
    title: 'Careers at Velune Hospital',
    description: 'Open roles for doctors, nurses and allied health staff at Velune Hospital, Kochi.',
  },
  education: {
    path: '/education',
    label: 'Medical education',
    priority: 0.4,
    title: 'Medical education and training',
    description: 'DNB, fellowships, nursing courses and continuing medical education at Velune Hospital.',
  },
  faq: {
    path: '/faq',
    label: 'FAQs',
    priority: 0.6,
    title: 'Frequently asked questions',
    description:
      'Answers to common questions about appointments, emergency care, insurance, staying in hospital and reports.',
  },
  privacy: {
    path: '/privacy',
    label: 'Privacy',
    priority: 0.2,
    title: 'Privacy notice',
    description: 'How Velune Hospital collects, uses and protects your personal and health information.',
  },
  terms: {
    path: '/terms',
    label: 'Terms of use',
    priority: 0.2,
    title: 'Terms of use',
    description: 'The terms that apply when you use the Velune Hospital website.',
  },
  accessibility: {
    path: '/accessibility',
    label: 'Accessibility',
    priority: 0.3,
    title: 'Accessibility',
    description:
      'How we make the Velune Hospital website and buildings accessible, and how to tell us about a problem.',
  },
} satisfies Record<string, PageInfo>;

export type PageKey = keyof typeof pages;

export const departmentPage = (slug: string): PageInfo => {
  const d = departments.find((x) => x.slug === slug)!;
  return {
    path: `/departments/${d.slug}`,
    label: d.name,
    priority: 0.8,
    title: `${d.name} at Velune Hospital, Kochi`,
    description: `${d.short} What we treat, tests, treatments, our ${d.name.toLowerCase()} doctors and how to book.`,
  };
};

export const doctorPage = (slug: string): PageInfo => {
  const d = doctors.find((x) => x.slug === slug)!;
  return {
    path: `/doctors/${d.slug}`,
    label: d.name,
    priority: 0.6,
    title: `${d.name}, ${d.role}`,
    description: `${d.name} (${d.qualifications}), ${d.years} years’ experience. Speaks ${d.languages.join(', ')}. Next available ${d.nextAvailable.toLowerCase()}. Book online.`,
  };
};

export const treatmentPage = (slug: string): PageInfo => {
  const t = treatments.find((x) => x.slug === slug)!;
  return {
    path: `/treatments/${t.slug}`,
    label: t.name,
    priority: 0.7,
    title: `${t.name}: what to expect, recovery and cost`,
    description: t.summary,
  };
};

export const articlePage = (slug: string): PageInfo => {
  const a = articles.find((x) => x.slug === slug)!;
  return {
    path: `/health-library/${a.slug}`,
    label: a.title,
    priority: 0.5,
    title: a.title,
    description: a.summary,
  };
};

/** Every indexable page, for the sitemap, llms.txt and the Markdown index. */
export function allPages(): PageInfo[] {
  return [
    ...Object.values(pages),
    ...departments.map((d) => departmentPage(d.slug)),
    ...doctors.map((d) => doctorPage(d.slug)),
    ...treatments.map((t) => treatmentPage(t.slug)),
    ...articles.map((a) => articlePage(a.slug)),
  ];
}

export const primaryNav: { label: string; path: string }[] = [
  { label: 'Departments', path: pages.departments.path },
  { label: 'Find a doctor', path: pages.doctors.path },
  { label: 'Patients and visitors', path: pages.patients.path },
  { label: 'Facilities', path: pages.facilities.path },
  { label: 'Health library', path: pages.library.path },
  { label: 'About us', path: pages.about.path },
];
