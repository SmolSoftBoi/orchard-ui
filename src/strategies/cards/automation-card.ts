import { AutomationEntity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';

/**
 * Display automations in a tile.
 */
export class AutomationCardStrategy {
  /**
   * Generate the automation tile configuration.
   *
   * @param automationEntity - The automation to show.
   * @returns The Lovelace card configuration.
   */
  static async generate(
    automationEntity: AutomationEntity,
  ): Promise<LovelaceCardConfig> {
    return {
      type: 'tile',
      entity: automationEntity.uniqueIdentifier,
      state_content: ['state', 'last_triggered'],
      grid_options: {
        columns: 12,
      },
    };
  }
}
