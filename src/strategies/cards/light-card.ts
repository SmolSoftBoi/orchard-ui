import { LightEntity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';

export class LightCardStrategy {
  static async generate(lightEntity: LightEntity): Promise<LovelaceCardConfig> {
    return {
      type: 'tile',
      entity: lightEntity.uniqueIdentifier,
      features: await this.generateFeatures(lightEntity),
      visibility: [
        {
          condition: 'or',
          conditions: [
            {
              condition: 'state',
              entity: lightEntity.uniqueIdentifier,
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
          entity: lightEntity.uniqueIdentifier,
          state_not: 'unavailable',
        },
      ],
    };
  }

  static async generateFeatures(
    lightEntity: LightEntity
  ): Promise<{ type: string }[]> {
    const features = [];

    if (lightEntity.state.supportedColorModes.includes('brightness')) {
      features.push({
        type: 'light-brightness',
      });
    }

    if (lightEntity.state.supportedColorModes.includes('color_temp')) {
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
