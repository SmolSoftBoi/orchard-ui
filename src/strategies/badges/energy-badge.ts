import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';

/**
 * Generate a Lovelace badge from a CO₂ signal entity.
 */
export class EnergyBadgeStrategy {
  /**
   * Builds the Lovelace badge configuration for energy usage.
   */
  static async generate(co2SignalEntity: Entity): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: co2SignalEntity.uniqueIdentifier,
      name: co2SignalEntity.name,
      icon: co2SignalEntity.icon || 'mdi:lightning-bolt',
      color: 'light-green',
      show_name: true,
    };
  }
}
