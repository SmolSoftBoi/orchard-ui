import { describe, expect, test } from 'vitest';
import { CUSTOM_ELEMENT_NAME } from '../../config';
import { FloorDashboardStrategy } from './floor-dashboard';

const hass = {
  floors: {
    f1: { floor_id: 'f1', icon: 'mdi:home-floor-1' },
  },
  areas: {
    a1: { area_id: 'a1', floor_id: 'f1', name: 'Kitchen' },
    a2: { area_id: 'a2', floor_id: 'f1', name: 'Living' },
  },
} as any;

describe('FloorDashboardStrategy.generate', () => {
  test('returns views for a given floor', async () => {
    const config = await FloorDashboardStrategy.generate({ floor_id: 'f1' }, hass);

    expect(config).toEqual({
      views: [
        {
          type: 'sections',
          title: 'f1',
          path: 'f1',
          icon: 'mdi:home-floor-1',
          max_columns: 2,
          strategy: { type: `custom:${CUSTOM_ELEMENT_NAME}-floor`, floor_id: 'f1' },
        },
        {
          type: 'sections',
          title: 'Kitchen',
          path: 'a1',
          strategy: { type: `custom:${CUSTOM_ELEMENT_NAME}-room`, area_id: 'a1' },
        },
        {
          type: 'sections',
          title: 'Living',
          path: 'a2',
          strategy: { type: `custom:${CUSTOM_ELEMENT_NAME}-room`, area_id: 'a2' },
        },
      ],
    });
  });
});
