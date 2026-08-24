// tests/e2e/app.spec.js
import { expect, test } from '@playwright/test';

test('changes mode, thickness and shows reflected paths', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('표준 조건의 예상 경로')).toBeVisible();
  await expect(page.locator('[data-testid="table-region"] svg')).toHaveAttribute('viewBox', '0 0 2448 1224');
  await page.locator('[data-control="thickness"] input').fill('0.5');
  await expect(page.locator('.cue-path')).toBeVisible();
  await expect(page.locator('.object-path')).toBeVisible();
  await page.locator('[data-control="mode"]').selectOption('threeCushion');
  await expect(page.locator('[data-testid="table-region"] svg')).toHaveAttribute('viewBox', '0 0 2840 1420');
});

test('moves the panel below the table on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const table = await page.locator('[data-testid="table-region"]').boundingBox();
  const controls = await page.locator('[data-testid="control-panel"]').boundingBox();
  expect(controls.y).toBeGreaterThan(table.y + table.height);
});