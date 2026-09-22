// tests/state/shotState.test.js
import { expect, it } from 'vitest';
import { createInitialState, updateState } from '../../src/state/shotState.js';
import { circlesOverlap } from '../../src/domain/ballPlacement.js';
import { getTableSpec } from '../../src/domain/tableSpecs.js';

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
  expect(next.firstObjectBallId).toBe('red-1');
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
  expect(next.firstObjectBallId).toBe('red-1');
  expect(next.viaCushion.markerPosition).toEqual({ x: 620, y: 900 });
});

it('기본적으로 목적구 이동경로를 표시하고, 토글하면 전환된다', () => {
  const state = createInitialState('fourBall');
  expect(state.showObjectPath).toBe(true);
  const next = updateState(state, { type: 'toggleObjectPath' });
  expect(next.showObjectPath).toBe(false);
  const next2 = updateState(next, { type: 'toggleObjectPath' });
  expect(next2.showObjectPath).toBe(true);
});

it('모드를 변경하면 목적구 이동경로 표시 여부가 기본값으로 초기화된다', () => {
  const state = updateState(createInitialState('fourBall'), { type: 'toggleObjectPath' });
  expect(state.showObjectPath).toBe(false);
  const next = updateState(state, { type: 'setMode', mode: 'threeCushion' });
  expect(next.showObjectPath).toBe(true);
});

it('공 랜덤 배치 액션은 겹치지 않게 재배치하고 id/color/role과 쿠션 마커를 정리한다', () => {
  const state = { ...createInitialState('fourBall'), viaCushion: { markerPosition: { x: 100, y: 100 } } };
  const next = updateState(state, { type: 'randomizeBalls' });
  const spec = getTableSpec('fourBall');
  expect(next.viaCushion).toBeNull();
  expect(next.balls.map((b) => b.id)).toEqual(state.balls.map((b) => b.id));
  expect(next.balls.map((b) => b.color)).toEqual(state.balls.map((b) => b.color));
  expect(next.balls.map((b) => b.role)).toEqual(state.balls.map((b) => b.role));
  next.balls.forEach((ball) => {
    expect(ball.position.x).toBeGreaterThanOrEqual(spec.ballDiameter / 2);
    expect(ball.position.x).toBeLessThanOrEqual(spec.width - spec.ballDiameter / 2);
    expect(ball.position.y).toBeGreaterThanOrEqual(spec.ballDiameter / 2);
    expect(ball.position.y).toBeLessThanOrEqual(spec.height - spec.ballDiameter / 2);
  });
  for (let i = 0; i < next.balls.length; i += 1) {
    for (let j = i + 1; j < next.balls.length; j += 1) {
      expect(circlesOverlap(next.balls[i].position, next.balls[j].position, spec.ballDiameter)).toBe(false);
    }
  }
});