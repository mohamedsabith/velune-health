import { departments } from '@/content/departments';

/**
 * Agentic Resource Discovery manifest (https://agenticresourcediscovery.org/spec/).
 * Lists the machine-readable resources agents can use. Served at /.well-known/ard.json,
 * advertised by a Link header (rel="ard") on every page.
 */
export function renderArdManifest(siteUrl: string, updatedAt = '2026-11-23T00:00:00Z') {
  const publisher = new URL(siteUrl).hostname;
  const id = (name: string) => `urn:air:${publisher}:hospital:${name}`;
  return {
    entries: [
      {
        identifier: id('doctor-directory'),
        displayName: 'Velune Hospital doctor directory',
        type: 'application/json',
        url: `${siteUrl}/doctors.json`,
        description:
          'Every doctor at Velune Hospital, Kochi, with department, qualifications, languages, consultation fee, clinic days, profile URL and booking URL.',
        representativeQueries: [
          'Which cardiologists at Velune Hospital speak Malayalam?',
          'What does a consultation with an orthopaedic surgeon in Kochi cost?',
          'Which days does Dr. Meera K. see patients?',
        ],
        capabilities: ['doctor-search', 'clinic-days', 'consultation-fees'],
        tags: ['hospital', 'doctors', 'Kochi', ...departments.slice(0, 5).map((d) => d.name)],
        updatedAt,
      },
      {
        identifier: id('patient-api'),
        displayName: 'Velune Hospital appointment availability API',
        type: 'application/vnd.oai.openapi+json',
        url: `${siteUrl}/openapi.json`,
        description:
          'Read-only API that returns the clinic dates and free appointment times for a doctor. Bookings are always confirmed by a person in the web form.',
        representativeQueries: [
          'When is the next free appointment with a cardiologist at Velune Hospital?',
          'Is Dr. Rahul V. free on Friday afternoon?',
          'Find an appointment time with a paediatrician in Kochi this week',
        ],
        capabilities: ['get-clinic-dates', 'get-free-times'],
        tags: ['appointments', 'availability', 'hospital', 'Kochi'],
        updatedAt,
      },
    ],
  };
}

/** OpenAPI description of the public read-only endpoints. */
export function renderOpenApi(siteUrl: string) {
  return {
    openapi: '3.1.0',
    info: {
      title: 'Velune Hospital public API',
      version: '1.0.0',
      description:
        'Read-only data for patients and agents. Concept website: doctors and times are placeholders. A person confirms every booking at /book.',
    },
    servers: [{ url: siteUrl }],
    paths: {
      '/doctors.json': {
        get: {
          operationId: 'listDoctors',
          summary: 'List every doctor with department, languages, fee and clinic days',
          responses: { '200': { description: 'The doctor directory', content: { 'application/json': {} } } },
        },
      },
      '/api/availability': {
        get: {
          operationId: 'getAvailability',
          summary: 'Clinic dates for a doctor, or the free times on one date',
          parameters: [
            {
              name: 'doctor',
              in: 'query',
              required: true,
              description: 'Doctor slug from /doctors.json, for example meera-k',
              schema: { type: 'string' },
            },
            {
              name: 'date',
              in: 'query',
              required: false,
              description: 'A date (YYYY-MM-DD). Leave out to get the next clinic dates.',
              schema: { type: 'string', format: 'date' },
            },
          ],
          responses: {
            '200': {
              description: 'Clinic dates, or the times on the date with an available flag',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      doctor: { type: 'string' },
                      date: { type: 'string', format: 'date' },
                      clinicDates: { type: 'array', items: { type: 'string', format: 'date' } },
                      slots: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            value: { type: 'string', description: '24-hour time, HH:MM, Kochi time' },
                            time: {
                              type: 'string',
                              description: 'The time as people read it, for example 2:30 pm',
                            },
                            available: { type: 'boolean' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': { description: 'Unknown doctor or a badly formed date' },
          },
        },
      },
    },
  };
}
