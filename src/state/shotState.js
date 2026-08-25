// src/state/shotState.js
import { circlesOverlap, clampBallPosition } from '../domain/ballPlacement.js';
import { getTableSpec } from '../domain/tableSpecs.js';

const INITIAL_BALLS = {
  fourBall: [
    { id: 'white', role: 'cue', color: 'white', position: { x: 620, y: 900 } },
    { id: 'yellow', role: 'object', color: 'yellow', position: { x: 1230, y: 590 } },
    { id: 'red-1', role: 'object', color: 'red', position: { x: 1900, y: 350 } },
    { id: 'red-2', role: 'object', color: 'red', position: { x: 1980, y: 980 } },
  ],
  threeCushion: [
    { id: 'white', role: 'cue', color: 'white', position: { x: 700, y: 1050 } },
    { id: 'yellow', role: 'object', color: 'yellow', position: { x: 1420, y: 710 } },
    { id: 'red', role: 'object', color: 'red', position: { x: 2350, y: 350 } },
  ],
};

export function createInitialState(mode = 'fourBall') {
  return { mode, balls: structuredClone(INITIAL_BALLS[mode]), cueBallId: 'white', firstObjectBallId: 'yellow', thickness: 0.25, cutSide: 1, tipClockAngle: 0, tipLevel: 1, viaCushion: null };
}

export function updateState(state, action) {
  if (action.type === 'setMode') return createInitialState(action.mode);
if (action.type === 'setCueBall') {
    if (!state.balls.some((ball) => ball.id === action.ballId)) return state;
    const firstObjectBallId = state.firstObjectBallId === action.ballId
      ? state.balls.find((ball) => ball.id !== action.ballId).id
      : state.firstObjectBallId;
    return { ...state, cueBallId: action.ballId, firstObjectBallId };
  }
  if (action.type === 'setFirstObjectBall') return state.balls.some((ball) => ball.id === action.ballId && ball.id !== state.cueBallId) ? { ...state, firstObjectBallId: action.ballId } : state;
  if (action.type === 'setThickness') return { ...state, thickness: Math.min(1, Math.max(0, action.value)) };
  if (action.type === 'setCutSide') return { ...state, cutSide: action.value };
  if (action.type === 'setTip') return { ...state, tipClockAngle: action.clockAngle, tipLevel: action.level };
  if (action.type === 'moveBall') {
    const spec = getTableSpec(state.mode);
    const position = clampBallPosition(action.position, spec);
    const snap = (val, candidates) => { const nearest = candidates.reduce((a, b) => Math.abs(b - val) < Math.abs(a - val) ? b : a); return Math.abs(nearest - val) < spec.ballDiameter / 2 ? nearest : val; };
    const gridXs = Array.from({ length: 7 }, (_, i) => spec.width * (i + 1) / 8);
    const gridYs = Array.from({ length: 3 }, (_, i) => spec.height * (i + 1) / 4);
    const snapped = { x: snap(position.x, gridXs), y: snap(position.y, gridYs) };
    if (state.balls.some((ball) => ball.id !== action.ballId && circlesOverlap(snapped, ball.position, spec.ballDiameter))) return state;
    return { ...state, balls: state.balls.map((ball) => ball.id === action.ballId ? { ...ball, position: snapped } : ball) };
  }
  if (action.type === 'moveViaCushionMarker') {
    const spec = getTableSpec(state.mode);
    const clamped = clampBallPosition(action.position, spec);
    const target = state.balls.find((ball) => ball.id !== state.cueBallId && circlesOverlap(clamped, ball.position, spec.ballDiameter));
    if (target) return { ...state, viaCushion: null, firstObjectBallId: target.id };
    return { ...state, viaCushion: { markerPosition: clamped } };
  }
  return state;
}