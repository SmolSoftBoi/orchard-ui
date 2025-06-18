import { LightEntity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';

/**
 * Build Lovelace badge configs for light entities.
 */
export class LightsBadgeStrategy {
  /**
   * Create a badge that displays a light entity.
   *
   * @param lightEntity - The light to render.
   * @returns The badge configuration.
   */
  static async generate(
    lightEntity: LightEntity,
  ): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: lightEntity.uniqueIdentifier,
      name: lightEntity.name,
      icon: lightEntity.icon || 'mdi:lightbulb-group',
      show_name: true,
      state_content: ['state'],
    };
  }
}
