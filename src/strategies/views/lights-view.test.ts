import { describe, expect, test } from 'vitest';
import type { Hass } from '../../hass';
import { LightsViewStrategy } from './lights-view';

describe('LightsViewStrategy.generate', () => {
  test('returns empty lights view', async () => {
    const view = await LightsViewStrategy.generate({}, {} as Hass);
    expect(view).toEqual({ badges: [], sections: [] });
  });
});
