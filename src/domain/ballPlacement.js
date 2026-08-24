// src/domain/ballPlacement.js
export function clampBallPosition(point, spec) {
  const radius = spec.ballDiameter / 2;
  return {
    x: Math.min(spec.width - radius, Math.max(radius, point.x)),
    y: Math.min(spec.height - radius, Math.max(radius, point.y))
  };
}

export function circlesOverlap(a, b, diameter) {
  return Math.hypot(a.x - b.x, a.y - b.y) < diameter - 1e-9;
}