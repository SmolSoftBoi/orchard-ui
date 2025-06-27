import { describe, expect, test, vi } from 'vitest';
import type { Hass } from '../../hass';

vi.mock('@smolpack/hasskit', () => ({
  Home: class {
    constructor(hass: unknown) {
      void hass;
    }
  },
}));

import { ClimateViewStrategy } from './climate-view';

describe('ClimateViewStrategy.generate', () => {
  test('returns empty climate view', async () => {
    const view = await ClimateViewStrategy.generate({}, {} as unknown as Hass);
    expect(view).toEqual({ badges: [], sections: [] });
  });
});
