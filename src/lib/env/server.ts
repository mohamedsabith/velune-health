import 'server-only';
import { resolveEnv } from './schema';

/** Validated server environment. Importing this from a Client Component fails the build. */
export const env = resolveEnv(process.env);
