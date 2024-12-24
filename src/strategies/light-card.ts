import { Service } from '../home';
import { LovelaceCardConfig } from '../lovelace';

export class LightCard {
  static async generate(lightService: Service): Promise<LovelaceCardConfig> {
    return {
      type: 'tile',
      entity: lightService.id,
      features: await this.generateFeatures(lightService),
    };
  }

  static async generateFeatures(
    lightService: Service
  ): Promise<{ type: string }[]> {
    const features = [];

    if (
      (
        lightService.hassState.attributes.supported_color_modes as string[]
      ).includes('brightness')
    ) {
      features.push({
        type: 'light-brightness',
      });
    }

    if (
      (
        lightService.hassState.attributes.supported_color_modes as string[]
      ).includes('color_temp')
    ) {
      features.push(
        ...[
          {
            type: 'light-brightness',
          },
          {
            type: 'light-color-temp',
          },
        ]
      );
    }

    return features;
  }
}
