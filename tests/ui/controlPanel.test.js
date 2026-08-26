// tests/ui/controlPanel.test.js
import { expect, it, vi } from 'vitest';
import { renderControls } from '../../src/ui/controlPanel.js';
import { createInitialState } from '../../src/state/shotState.js';

it('두께 및 팁 컨트롤을 테이블 외부에 렌더링한다', () => {
  const host = document.createElement('aside');
  renderControls(host, createInitialState('fourBall'), vi.fn());
  expect(host.querySelector('[data-control="thickness"]')).not.toBeNull();
  expect(host.querySelector('[data-tip-ring="1"]').dataset.offsetMm).toBe('6');
  expect(host.querySelector('[data-tip-ring="3"]').dataset.offsetMm).toBe('18');
  expect(host.querySelector('[data-selected-tip]').getAttribute('r')).toBe('6');
  expect(host.textContent).toContain('왼쪽 맞힘');
  expect(host.textContent).toContain('오른쪽 맞힘');
});

it('쿠션 조준 중에는 두께 컨트롤을 숨긴다', () => {
  const host = document.createElement('aside');
  const state = { ...createInitialState('fourBall'), viaCushion: { markerPosition: { x: 1224, y: 32.75 } } };
  renderControls(host, state, vi.fn());
  expect(host.querySelector('[data-control="thickness"]')).toBeNull();
});