import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

const KEY_PAGES = [
  '/',
  '/book',
  '/doctors',
  '/departments/cardiology',
  '/emergency',
  '/health-library/monsoon-fevers',
  '/contact',
  '/faq',
];

for (const path of KEY_PAGES) {
  test(`${path} has no WCAG 2.2 A/AA violations`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
}

test('the moving photos can be paused', async ({ page }) => {
  await page.goto('/');
  const btn = page.getByRole('button', { name: 'Pause moving photos' });
  await btn.click();
  await expect(page.getByRole('button', { name: 'Play moving photos' })).toBeVisible();
});

test('the opening plays once and can be skipped', async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto('/');
  await expect(page.locator('#intro')).toBeAttached();
  await page.waitForTimeout(5000);
  await expect(page.locator('#intro')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.close();
});
