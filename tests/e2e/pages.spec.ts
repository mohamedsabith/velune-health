import { expect, PAGES, test } from './fixtures';

test.describe('every page', () => {
  for (const path of PAGES) {
    test(`${path} renders with one h1, a title and a canonical link`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page).toHaveTitle(/Velune/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        new RegExp(`${path === '/' ? '' : path}$`),
      );
      expect(errors).toEqual([]);
    });
  }
});

test('unknown pages return 404 with help', async ({ page }) => {
  const res = await page.goto('/no-such-page');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('couldn');
});
