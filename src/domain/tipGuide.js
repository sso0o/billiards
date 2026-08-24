// src/domain/tipGuide.js
import { getTableSpec } from './tableSpecs.js';

export function tipOffsetMm(level) {
  if (!Number.isInteger(level) || level < 0 || level > 3) throw new RangeError('Tip level must be 0, 1, 2, or 3');
  return level * 6;
}

export function tipPoint(center, clockAngle, level) {
  const radians = clockAngle * Math.PI / 180;
  const distance = tipOffsetMm(level);
  return { x: center.x + Math.sin(radians) * distance, y: center.y - Math.cos(radians) * distance };
}

export function miscueLimit(mode) {
  return getTableSpec(mode).ballDiameter / 4;
}

export function formatTipSelection(clockAngle, level) {
  const normalized = ((clockAngle % 360) + 360) % 360;
  const halfHours = Math.round(normalized / 15) % 24;
  const hour = (Math.floor(halfHours / 2) + 12) % 12 || 12;
  const minute = halfHours % 2 ? '30분' : '00분';
  return `${hour}시 ${minute} · ${level}팁`;
}

export function snapTipSelection(point, center) {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const distance = Math.hypot(dx, dy);
  const rawClockAngle = Math.atan2(dx, -dy) * 180 / Math.PI;
  const clockAngle = ((Math.round(rawClockAngle / 15) * 15) % 360 + 360) % 360;
  const level = Math.min(3, Math.max(0, Math.round(distance / 6)));
  return { clockAngle, level };
}