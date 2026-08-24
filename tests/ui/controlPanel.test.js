// tests/ui/controlPanel.test.js
import { expect, it, vi } from 'vitest';
import { renderControls } from '../../src/ui/controlPanel.js';
import { createInitialState } from '../../src/state/shotState.js';

it('renders thickness and actual tip controls outside the table', () => {
  const host = document.createElement('aside');
  renderControls(host, createInitialState('fourBall'), vi.fn());
  expect(host.querySelector('[data-control="thickness"]')).not.toBeNull();
  expect(host.querySelector('[data-tip-ring="1"]').dataset.offsetMm).toBe('6');
  expect(host.querySelector('[data-tip-ring="3"]').dataset.offsetMm).toBe('18');
  expect(host.querySelector('[data-selected-tip]').getAttribute('r')).toBe('6');
  expect(host.textContent).toContain('왼쪽 맞힘');
  expect(host.textContent).toContain('오른쪽 맞힘');
});