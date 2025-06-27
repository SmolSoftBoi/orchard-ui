import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { CUSTOM_ELEMENT_NAME } from '../../config';
import { AutomationsViewStrategy } from '../views/automations-view';
import { HomeViewStrategy } from '../views/home-view';
import type { Hass } from '../../hass';

vi.mock('@smolpack/hasskit', () => ({
  Home: class {
    zones = [{}];
    climateEntity = { icon: 'mdi:thermostat' };
    lightEntity = { icon: 'mdi:lightbulb' };
    lockEntity = { icon: 'mdi:lock' };
    mediaPlayerEntity = { icon: 'mdi:television' };
    constructor(hass: unknown, config?: unknown) {
      void hass;
      void config;
    }
  },
}));

import { HomeDashboardStrategy } from './home-dashboard';

describe('HomeDashboardStrategy.generate', () => {
  beforeEach(() => {
    vi.spyOn(AutomationsViewStrategy, 'maxColumns').mockReturnValue(3);
    vi.spyOn(HomeViewStrategy, 'maxColumns').mockReturnValue(2);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('returns a dashboard config with expected views', async () => {
    const hass = {} as unknown as Hass;
    const config = await HomeDashboardStrategy.generate({}, hass);

    expect(config).toEqual({
      views: [
        {
          type: 'sections',
          title: 'Home',
          path: 'home',
          icon: 'mdi:home',
          max_columns: 2,
          strategy: {
            type: `custom:${CUSTOM_ELEMENT_NAME}-home`,
            areas: [],
          },
        },
        {
          type: 'sections',
          title: 'Automations',
          icon: 'mdi:alarm',
          max_columns: 3,
          strategy: {
            type: `custom:${CUSTOM_ELEMENT_NAME}-automations`,
            areas: [],
          },
        },
        {
          type: 'sections',
          title: 'Climate',
          path: 'climate',
          icon: 'mdi:thermostat',
          strategy: {
            type: `custom:${CUSTOM_ELEMENT_NAME}-climate`,
            areas: [],
          },
        },
        {
          type: 'sections',
          title: 'Lights',
          path: 'lights',
          icon: 'mdi:lightbulb',
          strategy: {
            type: `custom:${CUSTOM_ELEMENT_NAME}-lights`,
            areas: [],
          },
        },
        {
          type: 'sections',
          title: 'Security',
          path: 'security',
          icon: 'mdi:lock',
          strategy: {
            type: `custom:${CUSTOM_ELEMENT_NAME}-security`,
            areas: [],
          },
        },
        {
          type: 'sections',
          title: 'Speakers & TVs',
          path: 'speakers-tvs',
          icon: 'mdi:television',
          strategy: {
            type: `custom:${CUSTOM_ELEMENT_NAME}-speakers-tvs`,
            areas: [],
          },
        },
      ],
    });
  });
});
