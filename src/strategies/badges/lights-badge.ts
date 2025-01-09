import { LightEntity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';

export class LightsBadgeStrategy {
  static async generate(
    lightEntity: LightEntity
  ): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: lightEntity.uniqueIdentifier,
      name: lightEntity.name,
      icon: 'mdi:lightbulb-group',
      show_name: true,
      state_content: ['state'],
    };
  }
}
