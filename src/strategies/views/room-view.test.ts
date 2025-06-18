import { describe, expect, test } from 'vitest';
import { RoomViewStrategy } from './room-view';

describe('RoomViewStrategy.generate', () => {
  test('returns view with empty lists', async () => {
    const view = await RoomViewStrategy.generate({}, {} as any);
    expect(view).toEqual({ badges: [], sections: [] });
  });
});
