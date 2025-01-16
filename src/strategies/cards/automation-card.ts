import { AutomationEntity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';

export class AutomationCardStrategy {
  static async generate(
    automationEntity: AutomationEntity
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
