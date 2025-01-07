import { Entity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';

export class ClimateCardStategy {
  static async generate(climateEntity: Entity): Promise<LovelaceCardConfig> {
    return {
      type: 'tile',
      entity: climateEntity.uniqueIdentifier,
      name: climateEntity.name,
      control: 'climate',
      features: await this.generateFeatures(),
    };
  }

  static async generateFeatures(): Promise<object[]> {
    const features = [
      {
        type: 'climate-hvac-modes',
        style: 'icons',
        hvac_modes: ['off', 'auto', 'heat', 'fan_only', 'cool', 'dry'],
      },
      {
        type: 'climate-fan-modes',
        style: 'dropdown',
      },
      {
        type: 'target-temperature',
      },
    ];

    return features;
  }
}
