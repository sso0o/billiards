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

export function randomizeBallPositions(balls, spec, rng = Math.random) {
  const radius = spec.ballDiameter / 2;
  const positions = [];
  for (let index = 0; index < balls.length; index += 1) {
    let candidate;
    for (let attempt = 0; attempt < 200; attempt += 1) {
      candidate = {
        x: radius + rng() * (spec.width - radius * 2),
        y: radius + rng() * (spec.height - radius * 2)
      };
      if (!positions.some((placed) => circlesOverlap(candidate, placed, spec.ballDiameter))) break;
    }
    positions.push(candidate);
  }
  return balls.map((ball, index) => ({ ...ball, position: positions[index] }));
}