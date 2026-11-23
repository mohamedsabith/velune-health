/**
 * Facts about the hospital, used by pages, structured data, llms.txt and the
 * Markdown renditions. Velune is a concept: every name, number and phone line
 * here is a placeholder, and the site says so (see `demoNotice`).
 */
export const site = {
  name: 'Velune Hospital',
  shortName: 'Velune',
  tagline: 'Care that takes its time.',
  description:
    'Velune Hospital is a 250-bed multi-speciality hospital on Riverside Avenue, Kochi, with a 24-hour emergency department, 32 departments and 120 specialist doctors.',
  demo: true,
  demoNotice:
    'Velune Hospital is a concept website. The hospital, its doctors, phone numbers, prices and patient stories are placeholders, not a real hospital.',
  founded: 2009,
  facts: {
    beds: 250,
    icuBeds: 30,
    doctors: 120,
    departments: 32,
    theatres: 8,
    patientsPerYear: '1.5 lakh',
    insurers: 40,
    erWaitMinutes: 9,
  },
  address: {
    street: '12 Riverside Avenue',
    locality: 'Kochi',
    region: 'Kerala',
    postalCode: '682016',
    country: 'IN',
    erEntrance: 'Gate 2, Market Road',
    mainEntrance: 'Gate 1, Riverside Avenue',
  },
  geo: { latitude: 9.9816, longitude: 76.2999 },
  phones: {
    emergency: '+91 484 000 2112',
    ambulance: '+91 484 000 2108',
    appointments: '+91 484 000 2400',
    careLine: '+91 484 000 2000',
    whatsapp: '+91 98470 02400',
    stateAmbulance: '108',
  },
  email: 'care@velune.example',
  hours: {
    outpatient: 'Monday to Saturday, 8 am to 8 pm',
    visiting: '11 am to 1 pm and 5 pm to 7 pm',
    emergency: 'Open 24 hours, every day',
    pharmacy: 'Open 24 hours',
    laboratory: 'Open 24 hours',
  },
  openingHoursSpec: [
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '20:00',
    },
  ],
  languages: ['English', 'Malayalam', 'Hindi', 'Tamil', 'Arabic'],
  accreditations: ['NABH accredited hospital', 'NABL accredited laboratory'],
  social: [] as string[],
} as const;

export type Site = typeof site;
