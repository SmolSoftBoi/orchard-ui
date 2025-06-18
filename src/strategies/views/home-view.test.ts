import { describe, expect, test, vi } from 'vitest';

vi.mock('@smolpack/hasskit', () => ({
  Home: class {
    floors = [];
    weatherEntity = undefined;
    climateEntity = undefined;
    lightEntity = undefined;
    lockEntity = undefined;
    mediaPlayerEntity = undefined;
    co2SignalEntity = undefined;
    wasteEntity = undefined;
    constructor(_hass: unknown, _config?: unknown) {}
    entitiesWithDomains() { return []; }
  },
  Floor: class {},
}));

import { HomeViewStrategy } from './home-view';

describe('HomeViewStrategy.generate', () => {
  test('returns empty badges and sections when no entities', async () => {
    const config = await HomeViewStrategy.generate({}, {} as any);
    expect(config).toEqual({ badges: [], sections: [] });
  });

  test('maxColumns equals number of floors', () => {
    expect(HomeViewStrategy.maxColumns([{}, {}] as any)).toBe(2);
  });
});
