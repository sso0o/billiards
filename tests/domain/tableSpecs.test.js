// tests/domain/tableSpecs.test.js
import { describe, expect, it } from 'vitest';
import { getTableSpec, tableToSvg } from '../../src/domain/tableSpecs.js';

describe('table specs', () => {
  it('uses approved four-ball dimensions', () => {
    expect(getTableSpec('fourBall')).toEqual({ width: 2448, height: 1224, ballDiameter: 65.5, maxCushions: 3 });
  });

  it('preserves scale when converting to SVG', () => {
    expect(tableToSvg({ x: 1224, y: 612 }, getTableSpec('fourBall'), 1000)).toEqual({ x: 500, y: 250 });
  });
});