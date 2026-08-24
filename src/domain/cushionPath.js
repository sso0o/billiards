// src/domain/cushionPath.js
import { dot, normalize, rotate } from './vector.js';

export function nextCushionHit(origin, direction, spec) {
  const r = spec.ballDiameter / 2;
  const candidates = [
    { t: (r - origin.x) / direction.x, normal: { x: 1, y: 0 } },
    { t: (spec.width - r - origin.x) / direction.x, normal: { x: -1, y: 0 } },
    { t: (r - origin.y) / direction.y, normal: { x: 0, y: 1 } },
    { t: (spec.height - r - origin.y) / direction.y, normal: { x: 0, y: -1 } }
  ].filter(({ t }) => Number.isFinite(t) && t > 1e-7).sort((a, b) => a.t - b.t);

  if (!candidates.length) return null;
  const hit = candidates[0];
  return { point: { x: origin.x + direction.x * hit.t, y: origin.y + direction.y * hit.t }, normal: hit.normal };
}

export function reflectFromCushion(direction, normal, sideSpin, tipLevel) {
  const reflected = {
    x: direction.x - 2 * dot(direction, normal) * normal.x,
    y: direction.y - 2 * dot(direction, normal) * normal.y
  };
  const adjustment = sideSpin * (tipLevel / 3) * 12 * Math.PI / 180;
  return normalize(rotate(reflected, adjustment));
}

export function traceCushions(origin, direction, spec, options) {
  const hits = [];
  let point = origin;
  let vector = normalize(direction);
  for (let index = 0; index < spec.maxCushions; index += 1) {
    const hit = nextCushionHit(point, vector, spec);
    if (!hit) break;
    hits.push(hit.point);
    vector = reflectFromCushion(vector, hit.normal, options.sideSpin, options.tipLevel);
    point = { x: hit.point.x + vector.x * 1e-5, y: hit.point.y + vector.y * 1e-5 };
  }
  return { hits, exitDirection: vector };
}