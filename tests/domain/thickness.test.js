// tests/domain/thickness.test.js
import { describe, expect, it } from 'vitest';
import { collisionDirections, ghostBallCenter, thicknessOffset } from '../../src/domain/thickness.js';

describe('thickness geometry', () => {
  it.each([[0, 100], [0.25, 75], [0.5, 50], [0.75, 25], [1, 0]])('maps thickness %s to offset %s', (t, expected) => {
    expect(thicknessOffset(50, t)).toBeCloseTo(expected, 8);
  });

  it('places a half-ball ghost center on the selected side', () => {
    const result = ghostBallCenter({ x: 0, y: 0 }, { x: 200, y: 0 }, 50, 0.5, 1);
    expect(result.x).toBeCloseTo(113.397, 3);
    expect(result.y).toBeCloseTo(50, 6);
  });

  it('sends the object along the contact normal', () => {
    const result = collisionDirections({ x: 0, y: 0 }, { x: 200, y: 0 }, { x: 113.397, y: 50 });
    expect(Math.hypot(result.object.x, result.object.y)).toBeCloseTo(1, 8);
    expect(Math.hypot(result.cue.x, result.cue.y)).toBeCloseTo(1, 8);
  });
});