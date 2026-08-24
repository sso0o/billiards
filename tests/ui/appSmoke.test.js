// tests/ui/appSmoke.test.js
import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';

describe('createApp', () => {
  it('renders the table and external control panel', () => {
    document.body.innerHTML = '<main id="app"></main>';
    createApp(document.querySelector('#app'));

    expect(document.querySelector('[data-testid="table-region"]')).not.toBeNull();
    expect(document.querySelector('[data-testid="control-panel"]')).not.toBeNull();
    expect(document.body.textContent).toContain('표준 조건의 예상 경로');
  });
});