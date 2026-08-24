// tests/domain/trajectory.test.js
import { expect, it } from 'vitest';
import { calculateTrajectory, truncateAtFirstBallCollision } from '../../src/domain/trajectory.js';
import { createInitialState } from '../../src/state/shotState.js';

it('returns aim, ghost, cue and object paths', () => {
  const result = calculateTrajectory(createInitialState('fourBall'));
  expect(result.aimLine).toHaveLength(2);
  expect(result.ghostBall.radius).toBe(32.75);
  expect(result.cuePath.points.length).toBeGreaterThan(1);
  expect(result.cuePath.control).toEqual(expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) }));
  expect(result.objectPath.length).toBeGreaterThan(1);
  expect(result.cuePath.points.length).toBeLessThanOrEqual(5);
});

it('stops a segment at the first unselected ball collision', () => {
  const result = truncateAtFirstBallCollision(
    [{ x: 0, y: 0 }, { x: 1000, y: 0 }],
    [{ id: 'red', position: { x: 500, y: 0 } }],
    [],
    65.5
  );
  expect(result.hitBallId).toBe('red');
  expect(result.points.at(-1).x).toBeCloseTo(434.5, 6);
});