import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';

/**
 * Build a weather badge configuration.
 */
export class WeatherBadgeStrategy {
  /**
   * Generate a badge representing the weather entity.
   *
   * @param weatherEntity - The weather entity to display.
   * @returns The badge configuration.
   */
  static async generate(weatherEntity: Entity): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: weatherEntity.uniqueIdentifier,
      name: weatherEntity.name,
      show_name: true,
      state_content: ['state', 'temperature'],
    };
  }
}
