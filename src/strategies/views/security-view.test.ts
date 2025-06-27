import { describe, expect, test } from 'vitest';
import type { Hass } from '../../hass';
import { SecurityViewStrategy } from './security-view';

describe('SecurityViewStrategy.generate', () => {
  test('returns empty security view', async () => {
    const view = await SecurityViewStrategy.generate({}, {} as Hass);
    expect(view).toEqual({ badges: [], sections: [] });
  });
});
