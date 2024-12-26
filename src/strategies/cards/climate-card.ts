import Service from '../../home/service/service';
import { LovelaceCardConfig } from '../../lovelace';

export class ClimateCardStategy {
  static async generate(climateService: Service): Promise<LovelaceCardConfig> {
    return {
      type: 'tile',
      entity: climateService.id,
      name: climateService.name,
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
