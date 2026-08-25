// src/ui/tableView.js
import { getTableSpec } from '../domain/tableSpecs.js';

const NS = 'http://www.w3.org/2000/svg';
const node = (name, attrs = {}) => { const el = document.createElementNS(NS, name); Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value)); return el; };

export function renderTable(container, state, trajectory) {
  const spec = getTableSpec(state.mode);
  const svg = node('svg', { viewBox: `0 0 ${spec.width} ${spec.height}`, role: 'img', 'aria-label': '당구 경로' });
  const defs = node('defs');
  const marker = node('marker', { id: 'path-arrow', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 8, markerHeight: 8, orient: 'auto-start-reverse' });
  marker.append(node('path', { d: 'M 0 0 L 10 5 L 0 10 z', class: 'path-arrow' }));
  defs.append(marker);
  svg.append(defs);
  svg.append(node('rect', { class: 'cloth', x: 0, y: 0, width: spec.width, height: spec.height }));
  for (let index = 1; index <= 7; index += 1) {
    const x = spec.width * index / 8;
    svg.append(node('circle', { 'data-rail': 'top', cx: x, cy: 12, r: 4 }));
    svg.append(node('circle', { 'data-rail': 'bottom', cx: x, cy: spec.height - 12, r: 4 }));
  }
  for (let index = 1; index <= 3; index += 1) {
    const y = spec.height * index / 4;
    svg.append(node('circle', { 'data-rail': 'left', cx: 12, cy: y, r: 4 }));
    svg.append(node('circle', { 'data-rail': 'right', cx: spec.width - 12, cy: y, r: 4 }));
  }
  for (const ball of state.balls) svg.append(node('circle', { 'data-ball': ball.id, class: `ball ball--${ball.color}`, cx: ball.position.x, cy: ball.position.y, r: spec.ballDiameter / 2 }));
  if (trajectory.aimLine) svg.append(node('polyline', { class: 'aim-line', points: trajectory.aimLine.map((p) => `${p.x},${p.y}`).join(' ') }));
  if (trajectory.blockedBallId) svg.querySelector(`[data-ball="${trajectory.blockedBallId}"]`).classList.add('ball--blocked');
  const ghostMarker = trajectory.ghostBall ?? trajectory.viaCushionMarker;
  if (ghostMarker) svg.append(node('circle', { class: 'ghost-ball', 'data-ghost-marker': '', cx: ghostMarker.center.x, cy: ghostMarker.center.y, r: ghostMarker.radius }));
  if (trajectory.cuePath) {
    const [cueStart, cueFirst, ...cueRest] = trajectory.cuePath.points;
    const cueD = cueFirst ? `M ${cueStart.x} ${cueStart.y} Q ${trajectory.cuePath.control.x} ${trajectory.cuePath.control.y} ${cueFirst.x} ${cueFirst.y} ${cueRest.map((p) => `L ${p.x} ${p.y}`).join(' ')}` : `M ${cueStart.x} ${cueStart.y}`;
    svg.append(node('path', { class: 'cue-path', d: cueD, 'marker-end': 'url(#path-arrow)' }));
    svg.append(node('polyline', { class: 'object-path', points: trajectory.objectPath.map((p) => `${p.x},${p.y}`).join(' '), 'marker-end': 'url(#path-arrow)' }));
    trajectory.cuePath.points.slice(1).forEach((point) => svg.append(node('circle', { class: 'cushion-hit cushion-hit--cue', cx: point.x, cy: point.y, r: 8 })));
    trajectory.objectPath.slice(1).forEach((point) => svg.append(node('circle', { class: 'cushion-hit cushion-hit--object', cx: point.x, cy: point.y, r: 8 })));
  }
  container.replaceChildren(svg);
  return svg;
}