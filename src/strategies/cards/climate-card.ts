import { ClimateEntity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';

/**
 * Render controls for climate devices.
 */
export class ClimateCardStrategy {
  /**
   * Build a climate control card.
   *
   * @param climateEntity - The climate entity to control.
   * @returns The Lovelace card configuration.
   */
  static async generate(
    climateEntity: ClimateEntity,
  ): Promise<LovelaceCardConfig> {
    return {
      type: 'tile',
      entity: climateEntity.uniqueIdentifier,
      name: climateEntity.name,
      control: 'climate',
      features: await this.generateFeatures(climateEntity),
    };
  }

  /**
   * Build a list of features for the climate card.
   *
   * @param climateEntity - The climate entity to inspect.
   * @returns The features to enable.
   */
  static async generateFeatures(
    climateEntity: ClimateEntity,
  ): Promise<object[]> {
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
    });

    return features;
  }
}
