import { describe, expect, test } from 'vitest';
import { FloorViewStrategy } from './floor-view';

describe('FloorViewStrategy.generate', () => {
  test('returns empty object when no floor_id is provided', async () => {
    const view = await FloorViewStrategy.generate({}, {} as any);
    expect(view).toEqual({});
  });
});
