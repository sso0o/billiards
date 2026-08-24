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

