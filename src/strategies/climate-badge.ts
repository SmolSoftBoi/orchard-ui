import { Hass, HassEntityRegistryDisplayEntry } from '../hass';
import { LovelaceBadgeConfig } from '../lovelace';

export type ClimateBadgeStrategyConfig = {
  entity_id?: string;
};

export class ClimateBadgeStrategy {
  static homeEntityId =
    'climate.magic_areas_climate_groups_global_climate_group';

  static async generate(
    config: ClimateBadgeStrategyConfig,
    hass: Hass
  ): Promise<LovelaceBadgeConfig | undefined> {
    const badge: LovelaceBadgeConfig = {
      type: 'entity',
      entity: config.entity_id || this.homeEntity(hass)?.entity_id,
      name: 'Climate',
      icon: 'mdi:fan',
      show_name: true,
    };

    return badge;
  }

  static homeEntity(hass: Hass): HassEntityRegistryDisplayEntry | undefined {
    const homeEntity = hass.entities[this.homeEntityId];

    if (homeEntity) {
      return homeEntity;
    }

    const climateEntities = Object.values(hass.entities).filter((entity) =>
      entity.entity_id.startsWith('climate.')
    );

    if (climateEntities.length === 1) {
      return climateEntities[0];
    }
  }
}
