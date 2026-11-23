import { z } from 'zod';

/**
 * Environment contract for the whole application.
 *
 * This module has no `server-only` guard on purpose: `next.config.ts` imports it
 * so that a misconfigured deployment fails at build time instead of at runtime.
 * Application code should import `@/lib/env/server` instead.
 */

/** Treat empty strings (common in .env files and CI secrets) as "not set". */
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === '' ? undefined : value), schema.optional());

export const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    /** Canonical public origin, e.g. https://velune-hospital.netlify.app (no trailing slash). */
    NEXT_PUBLIC_SITE_URL: optional(z.url({ protocol: /^https?$/ })),

    /** Platform-provided variables used as fallbacks (Vercel, Netlify). */
    VERCEL_ENV: optional(z.enum(['production', 'preview', 'development'])),
    VERCEL_PROJECT_PRODUCTION_URL: optional(z.string().regex(/^[a-z0-9.-]+$/i)),
    CONTEXT: optional(z.string()),
    URL: optional(z.url()),

    /** `auto` = index production only; `on`/`off` force the behaviour. */
    SITE_INDEXING: optional(z.enum(['auto', 'on', 'off'])),

    /** Optional appointment integration. Without it, booking runs in clearly labelled demonstration mode. */
    BOOKING_WEBHOOK_URL: optional(z.url({ protocol: /^https$/ })),
    BOOKING_WEBHOOK_SECRET: optional(z.string().min(32)),
  })
  .superRefine((env, ctx) => {
    if (env.BOOKING_WEBHOOK_URL && !env.BOOKING_WEBHOOK_SECRET) {
      ctx.addIssue({
        code: 'custom',
        path: ['BOOKING_WEBHOOK_SECRET'],
        message: 'BOOKING_WEBHOOK_SECRET (32+ characters) is required when a webhook URL is set.',
      });
    }
  });

export type RawEnv = z.infer<typeof envSchema>;

export interface ResolvedEnv {
  raw: RawEnv;
  /** Canonical origin without trailing slash. */
  siteUrl: string;
  /** Whether search engines and AI crawlers should index this deployment. */
  indexable: boolean;
  bookingMode: 'webhook' | 'demo';
}

export function resolveEnv(source: Record<string, string | undefined>): ResolvedEnv {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    throw new Error(`Invalid environment configuration:\n${z.prettifyError(parsed.error)}`);
  }
  const raw = parsed.data;

  const siteUrl = (
    raw.NEXT_PUBLIC_SITE_URL ??
    (raw.VERCEL_PROJECT_PRODUCTION_URL ? `https://${raw.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ??
    raw.URL ??
    'http://localhost:3000'
  ).replace(/\/+$/, '');

  const isPreviewDeployment =
    raw.VERCEL_ENV === 'preview' || raw.CONTEXT === 'deploy-preview' || raw.CONTEXT === 'branch-deploy';

  const indexing = raw.SITE_INDEXING ?? 'auto';
  const indexable = indexing === 'on' ? true : indexing === 'off' ? false : !isPreviewDeployment;

  return {
    raw,
    siteUrl,
    indexable,
    bookingMode: raw.BOOKING_WEBHOOK_URL ? 'webhook' : 'demo',
  };
}
