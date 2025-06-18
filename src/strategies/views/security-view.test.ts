import { describe, expect, test } from 'vitest';
import { SecurityViewStrategy } from './security-view';

describe('SecurityViewStrategy.generate', () => {
  test('returns empty security view', async () => {
    const view = await SecurityViewStrategy.generate({}, {} as any);
    expect(view).toEqual({ badges: [], sections: [] });
  });
});
