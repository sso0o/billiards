// tests/domain/trajectory.test.js
import { expect, it } from 'vitest';
import { calculateTrajectory, truncateAtFirstBallCollision } from '../../src/domain/trajectory.js';
import { createInitialState, updateState } from '../../src/state/shotState.js';

it('조준선, 고스트볼, 큐볼, 오브젝트 경로를 반환한다', () => {
  const result = calculateTrajectory(createInitialState('fourBall'));
  expect(result.aimLine).toHaveLength(2);
  expect(result.ghostBall.radius).toBe(32.75);
  expect(result.cuePath.points.length).toBeGreaterThan(1);
  expect(result.cuePath.control).toEqual(expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) }));
  expect(result.objectPath.length).toBeGreaterThan(1);
  expect(result.cuePath.points.length).toBeLessThanOrEqual(5);
});

it('선택하지 않은 첫 번째 공과의 충돌 지점에서 경로를 멈춘다', () => {
  const result = truncateAtFirstBallCollision(
      [{ x: 0, y: 0 }, { x: 1000, y: 0 }],
      [{ id: 'red', position: { x: 500, y: 0 } }],
      [],
      65.5
  );
  expect(result.hitBallId).toBe('red');
  expect(result.points.at(-1).x).toBeCloseTo(434.5, 6);
});

it('직접 경로가 막혀도 고스트 마커를 드래그할 수 있다', () => {
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

it('고스트 마커를 빈 공간으로 드래그하면 쿠션 반사 미리보기를 보여준다', () => {
  const state = updateState(createInitialState('fourBall'), { type: 'moveViaCushionMarker', position: { x: 1224, y: 100 } });
  const result = calculateTrajectory(state);
  expect(result.error).toBeUndefined();
  expect(result.viaCushionMarker.center).toEqual({ x: 1224, y: 100 });
  expect(result.aimLine[0]).toEqual({ x: 620, y: 900 });
  expect(result.aimLine.length).toBeGreaterThan(1);
  expect(result.cuePath).toBeUndefined();
});

it('마커가 첫 번째 오브젝트 공에 스냅되면 직접 조준 모드로 돌아간다', () => {
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

it('마커가 큐볼 위에 정확히 있을 때 오류를 반환한다', () => {
  const state = { ...createInitialState('fourBall'), viaCushion: { markerPosition: { x: 620, y: 900 } } };
  const result = calculateTrajectory(state);
  expect(result.error).toBe('조준 방향을 정할 수 없습니다.');
});

it('다른 공이 막으면 큐볼-쿠션 경로를 멈춘다', () => {
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