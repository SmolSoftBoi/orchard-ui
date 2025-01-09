import { AutomationEntity } from '@smolpack/hasskit';
import { HassEntityRegistryDisplayEntry } from '../../hass';
import { LovelaceCardConfig } from '../../lovelace';

export type AutomationCardStrategyConfig = {
  entity: HassEntityRegistryDisplayEntry;
};

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
