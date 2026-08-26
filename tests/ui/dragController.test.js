// tests/ui/dragController.test.js
import { expect, it, vi } from 'vitest';
import { bindBallDragging } from '../../src/ui/dragController.js';

if (typeof DOMPoint === 'undefined') {
    globalThis.DOMPoint = class DOMPoint {
        constructor(x = 0, y = 0) { this.x = x; this.y = y; }
    };
}

function stubSvgGeometry(svg) {
    svg.getScreenCTM = () => ({ inverse: () => ({}) });
    DOMPoint.prototype.matrixTransform = function () { return { x: this.x, y: this.y }; };
}

it('고스트 마커 드래그 시 moveViaCushionMarker를 디스패치한다', () => {
    const container = document.createElement('div');
    container.innerHTML = '<svg><circle data-ghost-marker cx="10" cy="10" r="4"></circle></svg>';
    stubSvgGeometry(container.querySelector('svg'));
    const dispatch = vi.fn();
    bindBallDragging(container, dispatch);
    const marker = container.querySelector('[data-ghost-marker]');
    marker.setPointerCapture = vi.fn();
    marker.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    const move = new Event('pointermove', { bubbles: true });
    Object.assign(move, { clientX: 42, clientY: 24 });
    container.dispatchEvent(move);
    expect(dispatch).toHaveBeenCalledWith({ type: 'moveViaCushionMarker', position: { x: 42, y: 24 } });
});

it('일반 공 드래그 시 moveBall을 디스패치한다', () => {
    const container = document.createElement('div');
    container.innerHTML = '<svg><circle data-ball="white" cx="10" cy="10" r="4"></circle></svg>';
    stubSvgGeometry(container.querySelector('svg'));
    const dispatch = vi.fn();
    bindBallDragging(container, dispatch);
    const ball = container.querySelector('[data-ball="white"]');
    ball.setPointerCapture = vi.fn();
    ball.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    const move = new Event('pointermove', { bubbles: true });
    Object.assign(move, { clientX: 5, clientY: 5 });
    container.dispatchEvent(move);
    expect(dispatch).toHaveBeenCalledWith({ type: 'moveBall', ballId: 'white', position: { x: 5, y: 5 } });
});