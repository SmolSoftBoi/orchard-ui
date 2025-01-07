import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';

export class WasteBadgeStrategy {
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
