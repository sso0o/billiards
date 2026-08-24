// tests/ui/tableView.test.js
import { expect, it } from 'vitest';
import { renderTable } from '../../src/ui/tableView.js';
import { createInitialState } from '../../src/state/shotState.js';
import { calculateTrajectory } from '../../src/domain/trajectory.js';

it('renders a 2:1 playing surface and all rail sights', () => {
  const host = document.createElement('div');
  const state = createInitialState('fourBall');
  renderTable(host, state, calculateTrajectory(state));
  expect(host.querySelector('svg').getAttribute('viewBox')).toBe('0 0 2448 1224');
  expect(host.querySelectorAll('[data-rail="top"]')).toHaveLength(7);
  expect(host.querySelectorAll('[data-rail="bottom"]')).toHaveLength(7);
  expect(host.querySelectorAll('[data-rail="left"]')).toHaveLength(3);
  expect(host.querySelectorAll('[data-rail="right"]')).toHaveLength(3);
  expect(host.querySelector('[data-ball="white"]').getAttribute('r')).toBe('32.75');
  expect(host.querySelector('.cue-path').getAttribute('d')).toContain('Q');
});