// src/ui/controlPanel.js
import { formatTipSelection, miscueLimit, snapTipSelection, tipOffsetMm, tipPoint } from '../domain/tipGuide.js';

export function renderControls(container, state, dispatch) {
  const selectedTip = tipPoint({ x: 0, y: 0 }, state.tipClockAngle, state.tipLevel);
  const ballRadius = miscueLimit(state.mode) * 2;
  const ballOptions = state.balls.map((ball) => `<option value="${ball.id}">${ball.id}</option>`).join('');
  const thicknessSection = state.viaCushion ? '' : `<section data-control="thickness"><h2>두께</h2><output>${Math.round(state.thickness * 8)}/8</output><input type="range" min="0" max="1" step="0.125" value="${state.thickness}"><div><button data-side="-1">왼쪽 맞힘</button><button data-side="1">오른쪽 맞힘</button></div></section>`;
  container.innerHTML = `
    <label>모드 <select data-control="mode"><option value="fourBall">4구</option><option value="threeCushion">3쿠션</option></select></label>
    <label>수구 <select data-control="cue-ball">${ballOptions}</select></label>
    <label>제1목적구 <select data-control="object-ball">${ballOptions}</select></label>
    ${thicknessSection}
    <label><input type="checkbox" data-control="show-object-path" ${state.showObjectPath ? 'checked' : ''}> 목적구 이동경로 표시</label>
    <section data-control="tip"><h2>당점</h2><svg viewBox="-40 -40 80 80" aria-label="시계식 당점 선택기"><circle class="cue-ball-outline" r="${ballRadius}"/><line class="tip-axis" x1="${-ballRadius}" y1="0" x2="${ballRadius}" y2="0"/><line class="tip-axis" x1="0" y1="${-ballRadius}" x2="0" y2="${ballRadius}"/>${[1,2,3].map((level) => `<circle data-tip-ring="${level}" data-offset-mm="${tipOffsetMm(level)}" r="${tipOffsetMm(level)}"/>`).join('')}<circle class="miscue-limit" r="${miscueLimit(state.mode)}"/><circle data-selected-tip cx="${selectedTip.x}" cy="${selectedTip.y}" r="6"/><circle class="tip-center" cx="${selectedTip.x}" cy="${selectedTip.y}" r="1.5"/></svg><output>${formatTipSelection(state.tipClockAngle, state.tipLevel)}</output></section>
  `;
  container.querySelector('[data-control="mode"]').value = state.mode;
  container.querySelector('[data-control="cue-ball"]').value = state.cueBallId;
  container.querySelector('[data-control="object-ball"]').value = state.firstObjectBallId;
  container.querySelector('[data-control="mode"]').addEventListener('change', (event) => dispatch({ type: 'setMode', mode: event.target.value }));
  container.querySelector('[data-control="cue-ball"]').addEventListener('change', (event) => dispatch({ type: 'setCueBall', ballId: event.target.value }));
  container.querySelector('[data-control="object-ball"]').addEventListener('change', (event) => dispatch({ type: 'setFirstObjectBall', ballId: event.target.value }));
  container.querySelector('[data-control="thickness"] input')?.addEventListener('input', (event) => dispatch({ type: 'setThickness', value: Number(event.target.value) }));
  container.querySelector('[data-control="show-object-path"]').addEventListener('change', () => dispatch({ type: 'toggleObjectPath' }));
  container.querySelectorAll('[data-side]').forEach((button) => button.addEventListener('click', () => dispatch({ type: 'setCutSide', value: Number(button.dataset.side) })));
  const tipSvg = container.querySelector('[data-control="tip"] svg');
  tipSvg.addEventListener('pointerdown', (event) => {
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(tipSvg.getScreenCTM().inverse());
    dispatch({ type: 'setTip', ...snapTipSelection({ x: point.x, y: point.y }, { x: 0, y: 0 }) });
  });
}