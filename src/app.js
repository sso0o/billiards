// src/app.js
import { calculateTrajectory } from './domain/trajectory.js';
import { createInitialState, updateState } from './state/shotState.js';
import { bindBallDragging } from './ui/dragController.js';
import { renderControls } from './ui/controlPanel.js';
import { renderTable } from './ui/tableView.js';

export function createApp(root) {
  let state = createInitialState('fourBall');
  root.innerHTML = '<section class="app-shell"><section data-testid="table-region" class="table-region"></section><aside data-testid="control-panel" class="control-panel"></aside></section><p data-error-message role="status"></p><p class="model-notice">표준 조건의 예상 경로</p>';
  const table = root.querySelector('[data-testid="table-region"]');
  const controls = root.querySelector('[data-testid="control-panel"]');
  const errorMessage = root.querySelector('[data-error-message]');
  const dispatch = (action) => { state = updateState(state, action); paint(); };
  const paint = () => { const trajectory = calculateTrajectory(state); renderTable(table, state, trajectory); renderControls(controls, state, dispatch); errorMessage.textContent = trajectory.error ?? ''; };
  bindBallDragging(table, dispatch);
  paint();
  return { destroy: () => root.replaceChildren() };
}