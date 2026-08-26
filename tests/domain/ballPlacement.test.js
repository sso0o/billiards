// tests/domain/ballPlacement.test.js
import { expect, it } from 'vitest';
import { clampBallPosition, circlesOverlap } from '../../src/domain/ballPlacement.js';

const spec = { width: 2448, height: 1224, ballDiameter: 65.5 };

it('공 반지름이 쿠션 안쪽에 위치한다', () => {
  expect(clampBallPosition({ x: -20, y: 1300 }, spec)).toEqual({ x: 32.75, y: 1191.25 });
});

it('겹침을 감지하지만 접하는 공은 허용한다', () => {
  expect(circlesOverlap({ x: 0, y: 0 }, { x: 65, y: 0 }, 65.5)).toBe(true);
  expect(circlesOverlap({ x: 0, y: 0 }, { x: 65.5, y: 0 }, 65.5)).toBe(false);
});