import { Hass, HassEntityRegistryDisplayEntry } from '../../hass';
import { LovelaceCardConfig } from '../../lovelace';

export type AutomationCardStrategyConfig = {
  entity: HassEntityRegistryDisplayEntry;
};

export class AutomationCardStrategy {
  static async generate(
    config: AutomationCardStrategyConfig,
    hass: Hass
  ): Promise<LovelaceCardConfig> {
    return {
      type: 'tile',
      entity: config.entity.entity_id,
      state_content: ['state', 'last_triggered'],
      grid_options: {
        columns: 12,
      },
    };
  }
}
