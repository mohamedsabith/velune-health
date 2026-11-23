import { test as base, expect } from '@playwright/test';
import { allPages } from '../../src/content/routes';

/** Shared fixture: the opening sequence is skipped unless a test opts in with `intro: true`. */
export const test = base.extend<{ intro: boolean }>({
  intro: [false, { option: true }],
  page: async ({ page, intro }, use) => {
    if (!intro) await page.addInitScript(() => sessionStorage.setItem('velune:intro', 'seen'));
    await use(page);
  },
});

export { expect };

/** Every indexable page on the site. */
export const PAGES = allPages()
  .filter((p) => !p.noindex)
  .map((p) => p.path);
