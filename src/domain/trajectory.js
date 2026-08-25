// src/domain/trajectory.js
import { getTableSpec } from './tableSpecs.js';
import { collisionDirections, ghostBallCenter } from './thickness.js';
import { nextCushionHit, traceCushions } from './cushionPath.js';
import { add, dot, normalize, rotate, scale, subtract } from './vector.js';

function firstSegmentCircleHit(start, end, center, diameter) {
  const segment = subtract(end, start);
  const segmentLength = Math.hypot(segment.x, segment.y);
  if (segmentLength < 1e-9) return null;
  const direction = normalize(segment);
  const relative = subtract(start, center);
  const b = 2 * dot(relative, direction);
  const c = dot(relative, relative) - diameter ** 2;
  const discriminant = b ** 2 - 4 * c;
  if (discriminant < 0) return null;
  const distance = (-b - Math.sqrt(discriminant)) / 2;
  return distance > 1e-7 && distance <= segmentLength ? add(start, scale(direction, distance)) : null;
}

export function truncateAtFirstBallCollision(points, balls, ignoreIds, diameter) {
  const result = [points[0]];
  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const candidates = balls
        .filter((ball) => !ignoreIds.includes(ball.id))
        .map((ball) => ({ ball, point: firstSegmentCircleHit(start, end, ball.position, diameter) }))
        .filter((candidate) => candidate.point)
        .sort((a, b) => Math.hypot(a.point.x - start.x, a.point.y - start.y) - Math.hypot(b.point.x - start.x, b.point.y - start.y));
    if (candidates.length) return { points: [...result, candidates[0].point], hitBallId: candidates[0].ball.id };
    result.push(end);
  }
  return { points: result, hitBallId: null };
}

export function cueCurveControl(start, end, objectDirection, tipClockAngle, tipLevel, ballDiameter) {
  const midpoint = scale(add(start, end), 0.5);
  const verticalSpin = Math.cos(tipClockAngle * Math.PI / 180) * (tipLevel / 3);
  return add(midpoint, scale(objectDirection, verticalSpin * ballDiameter * 1.5));
}

// incomingOrigin -> contactPoint 방향으로 공에 닿은 뒤의 큐볼/목적구 경로. 직선 모드와 쿠션 우선(스냅) 모드가 공유한다.
function buildContactPaths(incomingOrigin, contactPoint, object, cueId, state, spec) {
  const directions = collisionDirections(incomingOrigin, object.position, contactPoint);
  const sideSpin = Math.sign(Math.sin(state.tipClockAngle * Math.PI / 180));
  const verticalSpin = Math.cos(state.tipClockAngle * Math.PI / 180) * (state.tipLevel / 3);
  const tipSideAngle = sideSpin * (state.tipLevel / 3) * 12 * Math.PI / 180;
  let initialCueDirection = directions.cue;
  if (Math.hypot(directions.cue.x, directions.cue.y) > 1e-9) {
    const incoming = normalize(subtract(contactPoint, incomingOrigin));
    const followComponent = scale(directions.object, dot(incoming, directions.object));
    const blended = add(directions.cue, scale(followComponent, verticalSpin));
    const blendedLength = Math.hypot(blended.x, blended.y);
    const afterVertical = blendedLength > 1e-9 ? normalize(blended) : directions.cue;
    initialCueDirection = rotate(afterVertical, tipSideAngle);
  }
  const cueTrace = Math.hypot(directions.cue.x, directions.cue.y) === 0 ? { hits: [], exitDirection: directions.cue } : traceCushions(contactPoint, initialCueDirection, spec, { sideSpin, tipLevel: state.tipLevel });
  const objectTrace = traceCushions(object.position, directions.object, spec, { sideSpin: 0, tipLevel: 0 });
  const rawCuePoints = [contactPoint, ...cueTrace.hits];
  const rawObjectPoints = [object.position, ...objectTrace.hits];
  const cueResult = truncateAtFirstBallCollision(rawCuePoints, state.balls, [cueId, object.id], spec.ballDiameter);
  const objectResult = truncateAtFirstBallCollision(rawObjectPoints, state.balls, [object.id], spec.ballDiameter);
  const cueEnd = cueResult.points[1] ?? contactPoint;
  return {
    ghostBall: { center: contactPoint, radius: spec.ballDiameter / 2 },
    cuePath: {
      points: cueResult.points,
      control: cueCurveControl(contactPoint, cueEnd, directions.object, state.tipClockAngle, state.tipLevel, spec.ballDiameter),
      hitBallId: cueResult.hitBallId
    },
    objectPath: objectResult.points,
    objectHitBallId: objectResult.hitBallId
  };
}

function calculateViaCushionTrajectory(state, spec, cue, object) {
  const marker = state.viaCushion.markerPosition;
  const radius = spec.ballDiameter / 2;
  if (marker.x === cue.position.x && marker.y === cue.position.y) {
    return { error: '조준 방향을 정할 수 없습니다.', viaCushionMarker: { center: marker, radius } };
  }
  const direction = normalize(subtract(marker, cue.position));
  const { point: railPoint } = nextCushionHit(cue.position, direction, spec);
  const incomingBlock = truncateAtFirstBallCollision([cue.position, railPoint], state.balls, [cue.id, object.id], spec.ballDiameter);
  if (incomingBlock.hitBallId) {
    return { error: '선택하지 않은 공이 먼저 맞습니다.', aimLine: incomingBlock.points, blockedBallId: incomingBlock.hitBallId, viaCushionMarker: { center: marker, radius } };
  }
  const sideSpin = Math.sign(Math.sin(state.tipClockAngle * Math.PI / 180));
  const trace = traceCushions(cue.position, direction, spec, { sideSpin, tipLevel: state.tipLevel });
  return { aimLine: [cue.position, ...trace.hits], viaCushionMarker: { center: marker, radius } };
}

export function calculateTrajectory(state) {
  const spec = getTableSpec(state.mode);
  const cue = state.balls.find((ball) => ball.id === state.cueBallId);
  const object = state.balls.find((ball) => ball.id === state.firstObjectBallId);
  if (!cue || !object) return { error: '수구와 제1목적구를 선택하세요.' };
  if (state.viaCushion) return calculateViaCushionTrajectory(state, spec, cue, object);
  const radius = spec.ballDiameter / 2;
  const ghost = ghostBallCenter(cue.position, object.position, radius, state.thickness, state.cutSide);
  const incomingBlock = truncateAtFirstBallCollision([cue.position, ghost], state.balls, [cue.id, object.id], spec.ballDiameter);
  if (incomingBlock.hitBallId) {
    return { error: '선택하지 않은 공이 먼저 맞습니다.', aimLine: incomingBlock.points, blockedBallId: incomingBlock.hitBallId, ghostBall: { center: ghost, radius } };
  }
  return { aimLine: [cue.position, ghost], ...buildContactPaths(cue.position, ghost, object, cue.id, state, spec) };
}