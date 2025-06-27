import { describe, expect, test, vi } from 'vitest';
import type { Hass } from '../../hass';
import type { Floor } from '@smolpack/hasskit';

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
    constructor(hass: unknown, config?: unknown) {
      void hass;
      void config;
    }
    entitiesWithDomains() {
      return [];
    }
  },
  Floor: class {},
}));

import { HomeViewStrategy } from './home-view';

describe('HomeViewStrategy.generate', () => {
  test('returns empty badges and sections when no entities', async () => {
    const config = await HomeViewStrategy.generate({}, {} as unknown as Hass);
    expect(config).toEqual({ badges: [], sections: [] });
  });

  test('maxColumns equals number of floors', () => {
    const floors = [{} as Floor, {} as Floor];
    expect(HomeViewStrategy.maxColumns(floors)).toBe(2);
  });
});
