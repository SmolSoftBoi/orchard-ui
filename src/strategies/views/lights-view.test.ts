import { describe, expect, test } from 'vitest';
import { LightsViewStrategy } from './lights-view';

describe('LightsViewStrategy.generate', () => {
  test('returns empty lights view', async () => {
    const view = await LightsViewStrategy.generate({}, {} as any);
    expect(view).toEqual({ badges: [], sections: [] });
  });
});
