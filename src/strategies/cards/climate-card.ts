import { ClimateEntity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';

export class ClimateCardStategy {
  static async generate(climateEntity: ClimateEntity): Promise<LovelaceCardConfig> {
    return {
      type: 'tile',
      entity: climateEntity.uniqueIdentifier,
      name: climateEntity.name,
      control: 'climate',
      features: await this.generateFeatures(climateEntity),
    };
  }

  static async generateFeatures(climateEntity: ClimateEntity): Promise<object[]> {
    const features: object[] = [
      {
        type: 'climate-hvac-modes',
        style: 'icons',
        hvac_modes: ['off', 'auto', 'heat', 'fan_only', 'cool', 'dry'],
      },
    ];

    if (climateEntity.state.fanModes.length > 0) {
      features.push({
        type: 'climate-fan-modes',
        style: 'dropdown',
      });
    }

    features.push({
      type: 'target-temperature',
    })

    return features;
  }
}
