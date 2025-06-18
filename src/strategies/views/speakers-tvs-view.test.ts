import { describe, expect, test } from 'vitest';
import { SpeakersTvsViewStrategy } from './speakers-tvs-view';

describe('SpeakersTvsViewStrategy.generate', () => {
  test('returns empty speakers & TVs view', async () => {
    const view = await SpeakersTvsViewStrategy.generate({}, {} as any);
    expect(view).toEqual({ badges: [], sections: [] });
  });
});
