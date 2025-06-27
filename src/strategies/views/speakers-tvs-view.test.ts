import { describe, expect, test } from 'vitest';
import type { Hass } from '../../hass';
import { SpeakersTvsViewStrategy } from './speakers-tvs-view';

describe('SpeakersTvsViewStrategy.generate', () => {
  test('returns empty speakers & TVs view', async () => {
    const view = await SpeakersTvsViewStrategy.generate({}, {} as Hass);
    expect(view).toEqual({ badges: [], sections: [] });
  });
});
