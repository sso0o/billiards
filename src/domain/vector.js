// src/domain/vector.js
export const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
export const subtract = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
export const scale = (v, k) => ({ x: v.x * k, y: v.y * k });
export const dot = (a, b) => a.x * b.x + a.y * b.y;
export const length = (v) => Math.hypot(v.x, v.y);
export const normalize = (v) => { const n = length(v); if (n === 0) throw new RangeError('Zero-length vector'); return scale(v, 1 / n); };
export const perpendicular = (v, side = 1) => ({ x: -v.y * side, y: v.x * side });
export const rotate = (v, radians) => ({ x: v.x * Math.cos(radians) - v.y * Math.sin(radians), y: v.x * Math.sin(radians) + v.y * Math.cos(radians) });