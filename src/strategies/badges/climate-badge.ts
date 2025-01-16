import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';

export class ClimateBadgeStrategy {
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
