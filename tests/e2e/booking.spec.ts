import { expect, test } from './fixtures';

test('book an appointment from start to confirmation', async ({ page }) => {
  await page.goto('/book');
  await page.getByRole('button', { name: /^Cardiology/ }).click();
  await page.getByRole('button', { name: /Dr\. Meera K\./ }).click();
  await page.locator('.slot:not([disabled])').first().click();
  await page.getByRole('button', { name: 'Continue' }).click();

  // validation: nothing filled in yet
  await page.getByRole('button', { name: 'Confirm appointment' }).click();
  await expect(page.getByText('Enter the patient’s full name')).toBeVisible();

  await page.getByLabel('Full name').fill('Anjali Menon');
  await page.getByLabel('Mobile number').fill('+91 98470 12345');
  await page.getByLabel(/I agree/).check();
  await page.getByRole('button', { name: 'Confirm appointment' }).click();

  await page.waitForURL('**/book/confirmed');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your appointment is booked');
  await expect(page.locator('.ref')).toHaveText(/^VH-[A-Z2-9]{6}$/);
});

test('doctor links pre-fill the booking form', async ({ page }) => {
  await page.goto('/book?doctor=vivek-p');
  await expect(page.getByRole('heading', { name: 'Pick a date and time' })).toBeVisible();
  await expect(page.locator('.b-summary')).toContainText('Dr. Vivek P.');
});
