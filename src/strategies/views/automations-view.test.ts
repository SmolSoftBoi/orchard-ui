import { describe, expect, test, vi } from 'vitest';

vi.mock('@smolpack/hasskit', () => ({
  Home: class {
    floors = [];
    constructor(_hass: unknown, _config?: unknown) {}
    entitiesWithDomains() { return []; }
  },
}));

import { AutomationsViewStrategy } from './automations-view';
import { AutomationSectionStrategy } from '../sections/automations-section';

describe('AutomationsViewStrategy.generate', () => {
  test('returns a view with one automation section', async () => {
    vi.spyOn(AutomationSectionStrategy, 'generate').mockResolvedValue({ type: 'grid', cards: [] });

    const view = await AutomationsViewStrategy.generate({ areas: [] }, {} as any);

    expect(view).toEqual({ badges: [], sections: [{ type: 'grid', cards: [] }] });
  });
});
