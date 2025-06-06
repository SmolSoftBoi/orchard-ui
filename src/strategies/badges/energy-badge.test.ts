import { describe, expect, test } from 'vitest';
import { EnergyBadgeStrategy } from './energy-badge';
import type { Entity } from '@smolpack/hasskit';

const stubEntity = {
  uniqueIdentifier: 'sensor.co2',
  name: 'CO₂ Signal',
} as Entity;

describe('EnergyBadgeStrategy.generate', () => {
  test('returns a Lovelace badge config', async () => {
    const config = await EnergyBadgeStrategy.generate(stubEntity);
    expect(config).toEqual({
      type: 'entity',
      entity: 'sensor.co2',
      name: 'CO₂ Signal',
      icon: 'mdi:lightning-bolt',
      color: 'light-green',
      show_name: true,
    });
  });
});
