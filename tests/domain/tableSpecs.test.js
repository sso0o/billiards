// tests/domain/tableSpecs.test.js
import { describe, expect, it } from 'vitest';
import { getTableSpec, tableToSvg } from '../../src/domain/tableSpecs.js';

describe('테이블 스펙', () => {
  it('공인 사구 치수를 사용한다', () => {
    expect(getTableSpec('fourBall')).toEqual({ width: 2448, height: 1224, ballDiameter: 65.5, maxCushions: 3 });
  });

  it('SVG 변환 시 스케일을 유지한다', () => {
    expect(tableToSvg({ x: 1224, y: 612 }, getTableSpec('fourBall'), 1000)).toEqual({ x: 500, y: 250 });
  });
});