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

test('drags the ghost ball to preview a cushion bounce, then snaps it onto a ball for a direct shot', async ({ page }) => {
  await page.goto('/');
  const marker = page.locator('[data-ghost-marker]');
  await expect(marker).toBeVisible();
  expect(await page.locator('[data-control="thickness"]').count()).toBe(1);

  const markerBox = await marker.boundingBox();
  await page.mouse.move(markerBox.x + markerBox.width / 2, markerBox.y + markerBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(200, 100, { steps: 5 });
  await page.mouse.up();

  expect(await page.locator('[data-control="thickness"]').count()).toBe(0);
  const points = await page.locator('.aim-line').getAttribute('points');
  expect(points.trim().split(' ').length).toBeGreaterThan(2);

  const redBall = page.locator('[data-ball="red-1"]');
  const box = await redBall.boundingBox();
  const markerBoxAfter = await marker.boundingBox();
  await page.mouse.move(markerBoxAfter.x + markerBoxAfter.width / 2, markerBoxAfter.y + markerBoxAfter.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height + 20, { steps: 5 });
  await page.mouse.up();

  await expect(page.locator('[data-control="object-ball"]')).toHaveValue('red-1');
  await expect(page.locator('.cue-path')).toBeVisible();
  await expect(page.locator('.object-path')).toBeVisible();
  expect(await page.locator('[data-control="thickness"]').count()).toBe(1);
});

test('toggles the object ball path visibility', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('[data-control="show-object-path"]');
  await expect(toggle).toBeChecked();
  await expect(page.locator('.object-path')).toBeVisible();
  await expect(page.locator('.cue-path')).toBeVisible();

  await toggle.uncheck();
  await expect(page.locator('.object-path')).toHaveCount(0);
  await expect(page.locator('.cue-path')).toBeVisible();

  await toggle.check();
  await expect(page.locator('.object-path')).toBeVisible();
});

test('randomizes ball positions on button click', async ({ page }) => {
  await page.goto('/');
  const ball = page.locator('[data-ball="red-1"]');
  const before = await ball.boundingBox();
  await page.locator('[data-action="randomize-balls"]').click();
  const after = await ball.boundingBox();
  expect(after.x === before.x && after.y === before.y).toBe(false);
  await expect(page.locator('[data-testid="table-region"] svg')).toHaveAttribute('viewBox', '0 0 2448 1224');
});