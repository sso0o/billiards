// tests/domain/cushionPath.test.js
import { expect, it } from 'vitest';
import { nextCushionHit, railGeometry, reflectFromCushion, traceCushions } from '../../src/domain/cushionPath.js';

const spec = { width: 2448, height: 1224, ballDiameter: 65.5, maxCushions: 3 };

it('공 중심 기준으로 가장 가까운 오른쪽 쿠션 충돌 지점을 찾는다', () => {
  const hit = nextCushionHit({ x: 1000, y: 600 }, { x: 1, y: 0 }, spec);
  expect(hit.point.x).toBeCloseTo(2415.25, 8);
  expect(hit.normal).toEqual({ x: -1, y: 0 });
});

it('무회전 시 입사각과 동일한 각도로 반사한다', () => {
  expect(reflectFromCushion({ x: 0.8, y: -0.6 }, { x: 0, y: 1 }, 0, 0)).toEqual({ x: 0.8, y: 0.6 });
});

it('경로를 최대 3쿠션으로 제한한다', () => {
  expect(traceCushions({ x: 1000, y: 600 }, { x: 0.8, y: 0.6 }, spec, { sideSpin: 0, tipLevel: 0 }).hits).toHaveLength(3);
});

it('좌우 회전에 따라 반사각을 반대 방향으로 변경한다', () => {
  const incoming = { x: 0.8, y: -0.6 };
  const left = reflectFromCushion(incoming, { x: 0, y: 1 }, -1, 3);
  const right = reflectFromCushion(incoming, { x: 0, y: 1 }, 1, 3);
  expect(left.y).not.toBeCloseTo(right.y, 5);
  expect(left.x).not.toBeCloseTo(right.x, 5);
});

it('각 쿠션에 대해 축, 고정값, 법선을 반환한다', () => {
  expect(railGeometry('left', spec)).toEqual({ axis: 'x', value: 32.75, normal: { x: 1, y: 0 } });
  expect(railGeometry('right', spec)).toEqual({ axis: 'x', value: 2415.25, normal: { x: -1, y: 0 } });
  expect(railGeometry('top', spec)).toEqual({ axis: 'y', value: 32.75, normal: { x: 0, y: 1 } });
  expect(railGeometry('bottom', spec)).toEqual({ axis: 'y', value: 1191.25, normal: { x: 0, y: -1 } });
});