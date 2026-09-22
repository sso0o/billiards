// tests/ui/tableView.test.js
import { expect, it } from 'vitest';
import { renderTable } from '../../src/ui/tableView.js';
import { createInitialState, updateState } from '../../src/state/shotState.js';
import { calculateTrajectory } from '../../src/domain/trajectory.js';

it('2:1 경기 면, 모든 쿠션 포인트, 드래그 가능한 고스트 마커를 렌더링한다', () => {
  const host = document.createElement('div');
  const state = createInitialState('fourBall');
  renderTable(host, state, calculateTrajectory(state));
  expect(host.querySelector('svg').getAttribute('viewBox')).toBe('0 0 2448 1224');
  expect(host.querySelectorAll('[data-rail="top"]')).toHaveLength(7);
  expect(host.querySelectorAll('[data-rail="bottom"]')).toHaveLength(7);
  expect(host.querySelectorAll('[data-rail="left"]')).toHaveLength(3);
  expect(host.querySelectorAll('[data-rail="right"]')).toHaveLength(3);
  expect(host.querySelector('[data-ball="white"]').getAttribute('r')).toBe('32.75');
  expect(host.querySelector('.cue-path').getAttribute('d')).toContain('Q');
  expect(host.querySelector('[data-ghost-marker]')).not.toBeNull();
});

it('빈 공간 조준 시 점선 고스트 마커와 전체 반사 경로를 렌더링한다', () => {
  const host = document.createElement('div');
  const state = updateState(createInitialState('fourBall'), { type: 'moveViaCushionMarker', position: { x: 1224, y: 100 } });
  renderTable(host, state, calculateTrajectory(state));
  const marker = host.querySelector('[data-ghost-marker]');
  expect(marker).not.toBeNull();
  expect(marker.getAttribute('cx')).toBe('1224');
  expect(host.querySelector('.aim-line').getAttribute('points').trim().split(' ').length).toBeGreaterThan(2);
  expect(host.querySelector('.cue-path')).toBeNull();
});

it('showObjectPath가 false면 목적구 경로와 목적구 쿠션 점을 숨기고 큐볼 경로는 유지한다', () => {
  const host = document.createElement('div');
  const state = { ...createInitialState('fourBall'), showObjectPath: false };
  renderTable(host, state, calculateTrajectory(state));
  expect(host.querySelector('.cue-path')).not.toBeNull();
  expect(host.querySelector('.object-path')).toBeNull();
  expect(host.querySelectorAll('.cushion-hit--object')).toHaveLength(0);
});

it('showObjectPath가 true(기본값)면 목적구 경로를 렌더링한다', () => {
  const host = document.createElement('div');
  const state = createInitialState('fourBall');
  renderTable(host, state, calculateTrajectory(state));
  expect(host.querySelector('.object-path')).not.toBeNull();
});