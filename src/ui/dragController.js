// src/ui/dragController.js
export function bindBallDragging(container, dispatch) {
  let activeId = null;
  // ponytail: querySelector on each move so SVG replacement by paint() doesn't break the ref
  const toSvgPoint = (event) => { const svg = container.querySelector('svg'); const point = new DOMPoint(event.clientX, event.clientY); return point.matrixTransform(svg.getScreenCTM().inverse()); };
  container.addEventListener('pointerdown', (event) => { activeId = event.target.dataset.ball ?? null; if (activeId) event.target.setPointerCapture(event.pointerId); });
  container.addEventListener('pointermove', (event) => { if (!activeId) return; const point = toSvgPoint(event); dispatch({ type: 'moveBall', ballId: activeId, position: { x: point.x, y: point.y } }); });
  container.addEventListener('pointerup', () => { activeId = null; });
}