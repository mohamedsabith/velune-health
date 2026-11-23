import { expect, test } from './fixtures';

test('llms.txt lists pages, departments and doctors', async ({ request }) => {
  const res = await request.get('/llms.txt');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toMatch(/^# Velune Hospital/);
  expect(body).toContain('## Departments');
  expect(body).toContain('/md/doctors/meera-k');
});

test('pages answer Accept: text/markdown with Markdown', async ({ request }) => {
  const res = await request.get('/departments/cardiology', { headers: { Accept: 'text/markdown' } });
  expect(res.headers()['content-type']).toContain('text/markdown');
  expect(await res.text()).toContain('# Cardiology at Velune Hospital');
});

test('availability API returns free times', async ({ request }) => {
  const dates = await (await request.get('/api/availability?doctor=meera-k')).json();
  expect(dates.clinicDates.length).toBeGreaterThan(0);
  const day = await (
    await request.get(`/api/availability?doctor=meera-k&date=${dates.clinicDates[0]}`)
  ).json();
  expect(day.slots.some((s: { available: boolean }) => s.available)).toBe(true);
  expect((await request.get('/api/availability?doctor=nobody')).status()).toBe(400);
});

test('structured data describes the hospital', async ({ page }) => {
  await page.goto('/');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = blocks.map((b) => JSON.parse(b)['@type']).flat();
  expect(types).toContain('Hospital');
  expect(types).toContain('WebSite');
});

test('an ARD manifest is advertised and served', async ({ request }) => {
  const home = await request.get('/');
  expect(home.headers()['link']).toContain('</.well-known/ard.json>; rel="ard"');
  const ard = await (await request.get('/.well-known/ard.json')).json();
  expect(ard.entries.map((e: { url: string }) => new URL(e.url).pathname)).toEqual([
    '/doctors.json',
    '/openapi.json',
  ]);
  expect((await request.get('/openapi.json')).status()).toBe(200);
});

test('forms are annotated as WebMCP tools', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('form[toolname="send_message_to_hospital"]')).toHaveAttribute(
    'tooldescription',
    /help desk/,
  );
  await page.goto('/');
  await expect(page.locator('form[toolname="search_site"] input[name="q"]')).toBeVisible();
});
