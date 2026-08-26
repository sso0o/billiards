// tests/domain/thickness.test.js
import { describe, expect, it } from 'vitest';
import { collisionDirections, ghostBallCenter, thicknessOffset } from '../../src/domain/thickness.js';

describe('두께 기하학', () => {
  it.each([[0, 100], [0.25, 75], [0.5, 50], [0.75, 25], [1, 0]])('두께 %s를 오프셋 %s mm로 변환한다', (t, expected) => {
    expect(thicknessOffset(50, t)).toBeCloseTo(expected, 8);
  });

  it('선택한 방향에 반구 고스트 중심을 배치한다', () => {
    const result = ghostBallCenter({ x: 0, y: 0 }, { x: 200, y: 0 }, 50, 0.5, 1);
    expect(result.x).toBeCloseTo(113.397, 3);
    expect(result.y).toBeCloseTo(50, 6);
  });

  it('오브젝트 공을 접촉 법선 방향으로 보낸다', () => {
    const result = collisionDirections({ x: 0, y: 0 }, { x: 200, y: 0 }, { x: 113.397, y: 50 });
    expect(Math.hypot(result.object.x, result.object.y)).toBeCloseTo(1, 8);
    expect(Math.hypot(result.cue.x, result.cue.y)).toBeCloseTo(1, 8);
  });
});