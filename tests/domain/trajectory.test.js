// tests/domain/trajectory.test.js
import { expect, it } from 'vitest';
import { calculateTrajectory, truncateAtFirstBallCollision } from '../../src/domain/trajectory.js';
import { createInitialState, updateState } from '../../src/state/shotState.js';

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

it('keeps the ghost ball draggable even while the direct path is blocked', () => {
  const state = {
    ...createInitialState('fourBall'),
    thickness: 1,
    balls: [
      { id: 'white', role: 'cue', color: 'white', position: { x: 1000, y: 1000 } },
      { id: 'yellow', role: 'object', color: 'yellow', position: { x: 1000, y: 200 } },
      { id: 'blocker', role: 'object', color: 'red', position: { x: 1000, y: 600 } }
    ]
  };
  const result = calculateTrajectory(state);
  expect(result.error).toBe('선택하지 않은 공이 먼저 맞습니다.');
  expect(result.blockedBallId).toBe('blocker');
  expect(result.ghostBall).toEqual({ center: { x: 1000, y: 265.5 }, radius: 32.75 });
});

it('shows a cushion-reflected preview when the ghost marker is dragged to an empty spot', () => {
  const state = updateState(createInitialState('fourBall'), { type: 'moveViaCushionMarker', position: { x: 1224, y: 100 } });
  const result = calculateTrajectory(state);
  expect(result.error).toBeUndefined();
  expect(result.viaCushionMarker.center).toEqual({ x: 1224, y: 100 });
  expect(result.aimLine[0]).toEqual({ x: 620, y: 900 });
  expect(result.aimLine.length).toBeGreaterThan(1);
  expect(result.cuePath).toBeUndefined();
});

it('returns to direct-aim mode once the marker snaps onto the first object ball', () => {
  const base = createInitialState('fourBall');
  const state = updateState(
      { ...base, balls: [base.balls[0], { id: 'yellow', role: 'object', color: 'yellow', position: { x: 620, y: 200 } }] },
      { type: 'moveViaCushionMarker', position: { x: 620, y: 250 } }
  );
  expect(state.viaCushion).toBeNull();
  const result = calculateTrajectory(state);
  expect(result.error).toBeUndefined();
  expect(result.viaCushionMarker).toBeUndefined();
  expect(result.cuePath.points.length).toBeGreaterThan(0);
  expect(result.objectPath.length).toBeGreaterThan(0);
});

it('reports an error instead of crashing when the marker sits exactly on the cue ball', () => {
  const state = { ...createInitialState('fourBall'), viaCushion: { markerPosition: { x: 620, y: 900 } } };
  const result = calculateTrajectory(state);
  expect(result.error).toBe('조준 방향을 정할 수 없습니다.');
});

it('stops the cue-to-cushion segment when another ball blocks it', () => {
  const base = createInitialState('fourBall');
  const state = {
    ...base,
    viaCushion: { markerPosition: { x: 620, y: 100 } },
    balls: [...base.balls, { id: 'blocker', role: 'object', color: 'red', position: { x: 620, y: 500 } }]
  };
  const result = calculateTrajectory(state);
  expect(result.error).toBe('선택하지 않은 공이 먼저 맞습니다.');
  expect(result.blockedBallId).toBe('blocker');
});