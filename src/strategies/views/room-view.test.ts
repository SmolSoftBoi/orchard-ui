import { describe, expect, test } from 'vitest';
import type { Hass } from '../../hass';
import { RoomViewStrategy } from './room-view';

describe('RoomViewStrategy.generate', () => {
  test('returns view with empty lists', async () => {
    const view = await RoomViewStrategy.generate({}, {} as Hass);
    expect(view).toEqual({ badges: [], sections: [] });
  });
});
