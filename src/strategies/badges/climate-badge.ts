import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';

export class ClimateBadgeStrategy {
  static async generate(climateEntity: Entity): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: climateEntity.uniqueIdentifier,
      name: 'Climate',
      icon: 'mdi:fan',
      show_name: true,
    };
  }
}
