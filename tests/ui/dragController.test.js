// tests/ui/dragController.test.js
import { expect, it, vi } from 'vitest';
import { bindBallDragging } from '../../src/ui/dragController.js';

function stubSvgGeometry(svg) {
    svg.getScreenCTM = () => ({ inverse: () => ({}) });
    DOMPoint.prototype.matrixTransform = function () { return { x: this.x, y: this.y }; };
}

it('dispatches moveViaCushionMarker while dragging the ghost marker', () => {
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

it('dispatches moveBall (not moveViaCushionMarker) while dragging a plain ball', () => {
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