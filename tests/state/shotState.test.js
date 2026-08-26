// tests/state/shotState.test.js
import { expect, it } from 'vitest';
import { createInitialState, updateState } from '../../src/state/shotState.js';

it('모드를 변경하고 해당 모드의 기본값으로 초기화한다', () => {
  const state = createInitialState('fourBall');
  const next = updateState(state, { type: 'setMode', mode: 'threeCushion' });
  expect(next.mode).toBe('threeCushion');
  expect(next.balls).toHaveLength(3);
});

it('겹치는 이동을 거부한다', () => {
  const state = createInitialState('fourBall');
  const target = state.balls[1].position;
  const next = updateState(state, { type: 'moveBall', ballId: state.balls[0].id, position: target });
  expect(next.balls[0].position).toEqual(state.balls[0].position);
});

it('다른 공 근처가 아닐 때 고스트 마커를 자유롭게 이동하고 첫 번째 오브젝트 공을 유지한다', () => {
  const state = createInitialState('fourBall');
  const next = updateState(state, { type: 'moveViaCushionMarker', position: { x: 500, y: 700 } });
  expect(next.viaCushion).toEqual({ markerPosition: { x: 500, y: 700 } });
  expect(next.firstObjectBallId).toBe('yellow');
});

it('가까운 공에 마커를 스냅하고 첫 번째 오브젝트 공으로 설정하여 쿠션 미리보기 모드를 종료한다', () => {
  const state = createInitialState('fourBall');
  const next = updateState(state, { type: 'moveViaCushionMarker', position: { x: 1900, y: 400 } });
  expect(next.firstObjectBallId).toBe('red-1');
  expect(next.viaCushion).toBeNull();
});

it('큐볼 자체에는 스냅하지 않는다', () => {
  const state = createInitialState('fourBall');
  const next = updateState(state, { type: 'moveViaCushionMarker', position: { x: 620, y: 900 } });
  expect(next.firstObjectBallId).toBe('yellow');
  expect(next.viaCushion.markerPosition).toEqual({ x: 620, y: 900 });
});