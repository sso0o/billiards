// tests/domain/tipGuide.test.js
import { describe, expect, it } from 'vitest';
import { formatTipSelection, miscueLimit, snapTipSelection, tipOffsetMm, tipPoint } from '../../src/domain/tipGuide.js';

describe('팁 가이드', () => {
  it.each([[0, 0], [1, 6], [2, 12], [3, 18]])('레벨 %s를 %s mm로 변환한다', (level, mm) => {
    expect(tipOffsetMm(level)).toBe(mm);
  });

  it('12시 방향 1팁을 중심에서 6mm 위에 배치한다', () => {
    expect(tipPoint({ x: 100, y: 100 }, 0, 1)).toEqual({ x: 100, y: 94 });
  });

  it('공 반지름의 절반을 미스큐 경고 한계로 사용한다', () => {
    expect(miscueLimit('fourBall')).toBe(16.375);
    expect(miscueLimit('threeCushion')).toBe(15.375);
  });

  it('30분 단위 시계 레이블을 형식화한다', () => {
    expect(formatTipSelection(45, 1)).toBe('1시 30분 \u00b7 1팁');
  });

  it('포인터를 가장 가까운 30분 및 팁 링에 스냅한다', () => {
    expect(snapTipSelection({ x: 11.7, y: -0.4 }, { x: 0, y: 0 })).toEqual({ clockAngle: 90, level: 2 });
  });
});
