import { describe, expect, test, vi } from 'vitest';
import type { Hass } from '../../hass';

vi.mock('@smolpack/hasskit', () => ({
  Home: class {
    floors = [];
    constructor(hass: unknown, config?: unknown) {
      void hass;
      void config;
    }
    entitiesWithDomains() {
      return [];
    }
  },
}));

import { AutomationsViewStrategy } from './automations-view';
import { AutomationSectionStrategy } from '../sections/automations-section';

describe('AutomationsViewStrategy.generate', () => {
  test('returns a view with one automation section', async () => {
    vi.spyOn(AutomationSectionStrategy, 'generate').mockResolvedValue({
      type: 'grid',
      cards: [],
    });

    const view = await AutomationsViewStrategy.generate(
      { areas: [] },
      {} as unknown as Hass
    );

    expect(view).toEqual({
      badges: [],
      sections: [{ type: 'grid', cards: [] }],
    });
  });
});
