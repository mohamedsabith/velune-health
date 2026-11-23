'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { departments } from '@/content/departments';
import { doctors } from '@/content/doctors';
import { site } from '@/content/site';
import { clinicDates, slotsFor } from '@/lib/booking/slots';

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean; consequentialHint?: boolean };
  execute: (input: Record<string, unknown>) => Promise<unknown>;
}
interface ModelContext {
  registerTool: (tool: ToolDefinition, options?: { signal?: AbortSignal }) => unknown;
}

const text = (value: unknown) => ({
  content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value) }],
});

/**
 * WebMCP: registers the site's main tasks as typed tools that browser AI agents
 * can call directly (Chrome origin trial, `document.modelContext.registerTool`).
 * Read-only tools answer questions; booking only opens a pre-filled form, so a
 * person always confirms the appointment themselves.
 */
export function AgentTools() {
  const router = useRouter();

  useEffect(() => {
    const mc =
      (document as unknown as { modelContext?: ModelContext }).modelContext ??
      (navigator as unknown as { modelContext?: ModelContext }).modelContext;
    if (!mc?.registerTool) return;
    const controller = new AbortController();
    const tools: ToolDefinition[] = [
      {
        name: 'search_doctors',
        description:
          'Find Velune Hospital doctors by name, department, condition or spoken language. Returns each doctor with department, languages, consultation fee in INR, next available time and a booking URL.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Doctor name, department or condition, e.g. "cardiology" or "knee pain"',
            },
            language: { type: 'string', description: 'A language the doctor should speak, e.g. "Malayalam"' },
          },
        },
        annotations: { readOnlyHint: true },
        execute: async ({ query, language }) => {
          const q = String(query ?? '').toLowerCase();
          const lang = String(language ?? '').toLowerCase();
          const results = doctors
            .filter((d) => {
              const dept = departments.find((x) => x.slug === d.department);
              const hay = [d.name, d.role, dept?.name, ...(dept?.conditions ?? []), ...d.interests]
                .join(' ')
                .toLowerCase();
              return (!q || hay.includes(q)) && (!lang || d.languages.some((l) => l.toLowerCase() === lang));
            })
            .map((d) => ({
              slug: d.slug,
              name: d.name,
              role: d.role,
              languages: d.languages,
              feeInr: d.fee,
              nextAvailable: d.nextAvailable,
              profile: `/doctors/${d.slug}`,
              book: `/book?doctor=${d.slug}`,
            }));
          return text(results);
        },
      },
      {
        name: 'list_departments',
        description: 'List Velune Hospital departments with what each one treats.',
        inputSchema: { type: 'object', properties: {} },
        annotations: { readOnlyHint: true },
        execute: async () =>
          text(
            departments.map((d) => ({
              slug: d.slug,
              name: d.name,
              treats: d.short,
              url: `/departments/${d.slug}`,
            })),
          ),
      },
      {
        name: 'get_available_slots',
        description:
          'Get free outpatient appointment times for a doctor. If no date is given, returns the next clinic dates.',
        inputSchema: {
          type: 'object',
          properties: {
            doctor: { type: 'string', description: 'Doctor slug from search_doctors, e.g. "meera-k"' },
            date: { type: 'string', description: 'Date as YYYY-MM-DD' },
          },
          required: ['doctor'],
        },
        annotations: { readOnlyHint: true },
        execute: async ({ doctor, date }) => {
          const slug = String(doctor);
          if (!date) return text({ doctor: slug, clinicDates: clinicDates(slug) });
          return text({
            doctor: slug,
            date,
            free: slotsFor(slug, String(date))
              .filter((s) => s.available)
              .map((s) => s.value),
          });
        },
      },
      {
        name: 'start_appointment_booking',
        description:
          'Open the appointment form pre-filled with a doctor, date and time. The patient reviews and confirms it themselves; nothing is booked until they do.',
        inputSchema: {
          type: 'object',
          properties: {
            doctor: { type: 'string', description: 'Doctor slug' },
            date: { type: 'string', description: 'YYYY-MM-DD' },
            time: { type: 'string', description: 'HH:MM, 24-hour' },
          },
          required: ['doctor'],
        },
        execute: async ({ doctor, date, time }) => {
          const params = new URLSearchParams({ doctor: String(doctor) });
          if (date) params.set('date', String(date));
          if (time) params.set('time', String(time));
          router.push(`/book?${params.toString()}` as never);
          return text(
            'The booking form is open and pre-filled. Ask the patient to add their details and confirm.',
          );
        },
      },
      {
        name: 'get_emergency_information',
        description:
          'How to get emergency care at Velune Hospital right now: phone numbers, entrance and current wait.',
        inputSchema: { type: 'object', properties: {} },
        annotations: { readOnlyHint: true },
        execute: async () =>
          text({
            emergencyPhone: site.phones.emergency,
            ambulance: site.phones.ambulance,
            stateAmbulance: site.phones.stateAmbulance,
            entrance: site.address.erEntrance,
            open: site.hours.emergency,
            typicalWaitMinutes: site.facts.erWaitMinutes,
            advice: 'If life is in danger, call now. Treatment starts before any paperwork or payment.',
          }),
      },
    ];
    tools.forEach((t) => {
      try {
        void mc.registerTool(t, { signal: controller.signal });
      } catch {
        /* an older implementation without the options argument */
      }
    });
    return () => controller.abort();
  }, [router]);

  return null;
}
