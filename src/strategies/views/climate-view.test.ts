import { describe, expect, test, vi } from 'vitest';

vi.mock('@smolpack/hasskit', () => ({
  Home: class {
    constructor(_hass: unknown) {}
  },
}));

import { ClimateViewStrategy } from './climate-view';

describe('ClimateViewStrategy.generate', () => {
  test('returns empty climate view', async () => {
    const view = await ClimateViewStrategy.generate({}, {} as any);
    expect(view).toEqual({ badges: [], sections: [] });
  });
});
