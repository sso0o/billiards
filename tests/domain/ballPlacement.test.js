// tests/domain/ballPlacement.test.js
import { expect, it } from 'vitest';
import { clampBallPosition, circlesOverlap, randomizeBallPositions } from '../../src/domain/ballPlacement.js';

const spec = { width: 2448, height: 1224, ballDiameter: 65.5 };

it('공 반지름이 쿠션 안쪽에 위치한다', () => {
  expect(clampBallPosition({ x: -20, y: 1300 }, spec)).toEqual({ x: 32.75, y: 1191.25 });
});

it('겹침을 감지하지만 접하는 공은 허용한다', () => {
  expect(circlesOverlap({ x: 0, y: 0 }, { x: 65, y: 0 }, 65.5)).toBe(true);
  expect(circlesOverlap({ x: 0, y: 0 }, { x: 65.5, y: 0 }, 65.5)).toBe(false);
});

function stubRng(sequence) {
  let i = 0;
  return () => sequence[i++ % sequence.length];
}

it('rng 시퀀스에 따라 좌표를 뽑고, 겹치는 후보는 다시 뽑는다', () => {
  const balls = [
    { id: 'white', role: 'cue', color: 'white', position: { x: 0, y: 0 } },
    { id: 'yellow', role: 'object', color: 'yellow', position: { x: 0, y: 0 } },
  ];
  const rng = stubRng([0, 0, 0, 0, 1, 1]);
  const result = randomizeBallPositions(balls, spec, rng);
  expect(result[0]).toMatchObject({ id: 'white', position: { x: 32.75, y: 32.75 } });
  expect(result[1]).toMatchObject({ id: 'yellow', position: { x: 2415.25, y: 1191.25 } });
});

it('계속 겹치는 rng라도 최대 시도 횟수 안에서 멈추고 좌표를 반환한다', () => {
  const balls = [
    { id: 'white', role: 'cue', color: 'white', position: { x: 0, y: 0 } },
    { id: 'yellow', role: 'object', color: 'yellow', position: { x: 0, y: 0 } },
  ];
  const rng = stubRng([0]);
  const result = randomizeBallPositions(balls, spec, rng);
  expect(result[0].position).toEqual({ x: 32.75, y: 32.75 });
  expect(result[1].position).toEqual({ x: 32.75, y: 32.75 });
});