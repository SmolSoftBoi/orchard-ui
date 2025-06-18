import { LightEntity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';

/**
 * Build tiles for light controls.
 */
export class LightCardStrategy {
  /**
   * Generate a card for a light entity.
   *
   * @param lightEntity - The light to control.
   * @returns The card configuration.
   */
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

  /**
   * Determine which light features to expose.
   *
   * @param lightEntity - The light entity to inspect.
   * @returns The feature list for the card.
   */
  static async generateFeatures(
    lightEntity: LightEntity,
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
