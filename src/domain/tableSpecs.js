// src/domain/tableSpecs.js
const SPECS = Object.freeze({
  fourBall: Object.freeze({ width: 2448, height: 1224, ballDiameter: 65.5, maxCushions: 3 }),
  threeCushion: Object.freeze({ width: 2840, height: 1420, ballDiameter: 61.5, maxCushions: 3 })
});

export function getTableSpec(mode) {
  const spec = SPECS[mode];
  if (!spec) throw new RangeError(`Unsupported mode: ${mode}`);
  return spec;
}

export function tableToSvg(point, spec, svgWidth) {
  const scale = svgWidth / spec.width;
  return { x: point.x * scale, y: point.y * scale };
}