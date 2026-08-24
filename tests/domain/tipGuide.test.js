// tests/domain/tipGuide.test.js
import { describe, expect, it } from 'vitest';
import { formatTipSelection, miscueLimit, snapTipSelection, tipOffsetMm, tipPoint } from '../../src/domain/tipGuide.js';

describe('tip guide', () => {
  it.each([[0, 0], [1, 6], [2, 12], [3, 18]])('maps level %s to %s mm', (level, mm) => {
    expect(tipOffsetMm(level)).toBe(mm);
  });

  it('places 12 o’clock one-tip 6 mm above center', () => {
    expect(tipPoint({ x: 100, y: 100 }, 0, 1)).toEqual({ x: 100, y: 94 });
  });

  it('uses half the ball radius as warning limit', () => {
    expect(miscueLimit('fourBall')).toBe(16.375);
    expect(miscueLimit('threeCushion')).toBe(15.375);
  });

  it('formats half-hour clock labels', () => {
    expect(formatTipSelection(45, 1)).toBe('1시 30분 · 1팁');
  });

  it('snaps a pointer to the nearest half-hour and tip ring', () => {
    expect(snapTipSelection({ x: 11.7, y: -0.4 }, { x: 0, y: 0 })).toEqual({ clockAngle: 90, level: 2 });
  });
});