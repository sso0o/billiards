// tests/state/shotState.test.js
import { expect, it } from 'vitest';
import { createInitialState, updateState } from '../../src/state/shotState.js';

it('changes mode and resets to that mode preset', () => {
  const state = createInitialState('fourBall');
  const next = updateState(state, { type: 'setMode', mode: 'threeCushion' });
  expect(next.mode).toBe('threeCushion');
  expect(next.balls).toHaveLength(3);
});

it('rejects an overlapping move', () => {
  const state = createInitialState('fourBall');
  const target = state.balls[1].position;
  const next = updateState(state, { type: 'moveBall', ballId: state.balls[0].id, position: target });
  expect(next.balls[0].position).toEqual(state.balls[0].position);
});

it('moves the ghost marker freely and leaves the first object ball unchanged when it is not near another ball', () => {
  const state = createInitialState('fourBall');
  const next = updateState(state, { type: 'moveViaCushionMarker', position: { x: 500, y: 700 } });
  expect(next.viaCushion).toEqual({ markerPosition: { x: 500, y: 700 } });
  expect(next.firstObjectBallId).toBe('yellow');
});

it('snaps the marker onto a nearby ball, sets it as the first object ball, and exits cushion-preview mode', () => {
  const state = createInitialState('fourBall');
  const next = updateState(state, { type: 'moveViaCushionMarker', position: { x: 1900, y: 400 } });
  expect(next.firstObjectBallId).toBe('red-1');
  expect(next.viaCushion).toBeNull();
});

it('never snaps onto the cue ball itself', () => {
  const state = createInitialState('fourBall');
  const next = updateState(state, { type: 'moveViaCushionMarker', position: { x: 620, y: 900 } });
  expect(next.firstObjectBallId).toBe('yellow');
  expect(next.viaCushion.markerPosition).toEqual({ x: 620, y: 900 });
});