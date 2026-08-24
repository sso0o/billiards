// src/domain/thickness.js
import { add, normalize, perpendicular, scale, subtract } from './vector.js';

export function thicknessOffset(radius, thickness) {
  if (thickness < 0 || thickness > 1) throw new RangeError('Thickness must be between 0 and 1');
  return 2 * radius * (1 - thickness);
}

export function ghostBallCenter(cue, object, radius, thickness, cutSide) {
  if (![ -1, 1 ].includes(cutSide)) throw new RangeError('cutSide must be -1 or 1');
  const offset = thicknessOffset(radius, thickness);
  const contactDistance = 2 * radius;
  const forwardDistance = Math.sqrt(Math.max(0, contactDistance ** 2 - offset ** 2));
  const fromCue = normalize(subtract(object, cue));
  const side = perpendicular(fromCue, cutSide);
  return add(object, add(scale(fromCue, -forwardDistance), scale(side, offset)));
}

export function collisionDirections(cue, object, ghost) {
  const incoming = normalize(subtract(ghost, cue));
  const objectDirection = normalize(subtract(object, ghost));
  const projection = incoming.x * objectDirection.x + incoming.y * objectDirection.y;
  const cueRemainder = {
    x: incoming.x - projection * objectDirection.x,
    y: incoming.y - projection * objectDirection.y
  };
  const cueDirection = Math.hypot(cueRemainder.x, cueRemainder.y) < 1e-9
    ? { x: 0, y: 0 }
    : normalize(cueRemainder);
  return { cue: cueDirection, object: objectDirection };
}