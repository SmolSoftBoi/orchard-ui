import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';

/**
 * Display upcoming waste collection information.
 */
export class WasteBadgeStrategy {
  /**
   * Generate configuration for a waste entity badge.
   *
   * @param wasteEntity - The waste schedule entity.
   * @returns The badge configuration.
   */
  static async generate(wasteEntity: Entity): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: wasteEntity.uniqueIdentifier,
      name: 'Waste',
      show_name: true,
      state_content: ['message'],
    };
  }
}
