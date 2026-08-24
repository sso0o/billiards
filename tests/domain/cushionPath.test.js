// tests/domain/cushionPath.test.js
import { expect, it } from 'vitest';
import { nextCushionHit, reflectFromCushion, traceCushions } from '../../src/domain/cushionPath.js';

const spec = { width: 2448, height: 1224, ballDiameter: 65.5, maxCushions: 3 };

it('finds the nearest right-cushion hit using ball-center bounds', () => {
  const hit = nextCushionHit({ x: 1000, y: 600 }, { x: 1, y: 0 }, spec);
  expect(hit.point.x).toBeCloseTo(2415.25, 8);
  expect(hit.normal).toEqual({ x: -1, y: 0 });
});

it('reflects equal angles without spin', () => {
  expect(reflectFromCushion({ x: 0.8, y: -0.6 }, { x: 0, y: 1 }, 0, 0)).toEqual({ x: 0.8, y: 0.6 });
});

it('limits the path to three cushion hits', () => {
  expect(traceCushions({ x: 1000, y: 600 }, { x: 0.8, y: 0.6 }, spec, { sideSpin: 0, tipLevel: 0 }).hits).toHaveLength(3);
});


it('changes reflection in opposite directions for left and right spin', () => {
  const incoming = { x: 0.8, y: -0.6 };
  const left = reflectFromCushion(incoming, { x: 0, y: 1 }, -1, 3);
  const right = reflectFromCushion(incoming, { x: 0, y: 1 }, 1, 3);
  expect(left.y).not.toBeCloseTo(right.y, 5);
  expect(left.x).not.toBeCloseTo(right.x, 5);
});