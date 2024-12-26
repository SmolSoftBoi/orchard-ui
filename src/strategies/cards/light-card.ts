import Service from '../../home/service';
import { LovelaceCardConfig } from '../../lovelace';

export class LightCardStrategy {
  static async generate(lightService: Service): Promise<LovelaceCardConfig> {
    return {
      type: 'tile',
      entity: lightService.id,
      features: await this.generateFeatures(lightService),
      visibility: [
        {
          condition: 'or',
          conditions: [
            {
              condition: 'state',
              entity: lightService.id,
              state: 'on',
            },
            {
              condition: 'state',
              entity: 'sun.sun',
              state: 'below_horizon',
            },
          ],
        },
        {
          condition: 'state',
          entity: lightService.id,
          state_not: 'unavailable',
        },
      ],
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
