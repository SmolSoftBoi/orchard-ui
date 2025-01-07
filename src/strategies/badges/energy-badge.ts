import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';

export class EnergyBadgeStrategy {
  static async generate(
    c02SignalEntity: Entity
  ): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: c02SignalEntity.uniqueIdentifier,
      name: 'Energy',
      icon: 'mdi:lightning-bolt',
      color: 'light-green',
      show_name: true,
    };
  }
}
