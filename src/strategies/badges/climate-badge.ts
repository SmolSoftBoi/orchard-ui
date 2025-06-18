import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';

/**
 * Build a badge for climate entities like thermostats or fans.
 */
export class ClimateBadgeStrategy {
  /**
   * Create the Lovelace configuration for a climate badge.
   *
   * @param climateEntity - The entity representing the climate device.
   * @returns The badge configuration.
   */
  static async generate(climateEntity: Entity): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: climateEntity.uniqueIdentifier,
      name: climateEntity.name,
      icon: climateEntity.icon || 'mdi:fan',
      show_name: true,
    };
  }
}
