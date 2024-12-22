import { Hass, HassEntityRegistryDisplayEntry } from '../hass';
import { LovelaceBadgeConfig } from '../lovelace';

export type LightsBadgeStrategyConfig = {
  entity_id?: string;
};

export class LightsBadgeStrategy {
  static homeEntityId = 'light.magic_areas_light_groups_global';

  static async generate(
    config: LightsBadgeStrategyConfig,
    hass: Hass,
  ): Promise<LovelaceBadgeConfig | undefined> {
    const badge: LovelaceBadgeConfig = {
      type: 'entity',
      entity: this.homeEntity(hass)?.entity_id,
      name: 'Lights',
      icon: 'mdi:lightbulb-group',
      show_name: true,
      state_content: ['state'],
    };

    return badge;
  }

  static homeEntity(hass: Hass): HassEntityRegistryDisplayEntry | undefined {
    const homeEntity = hass.entities[this.homeEntityId];

    if (homeEntity) {
      return homeEntity;
    }

    const lightEntities = Object.values(hass.entities).filter((entity) =>
      entity.entity_id.startsWith('light.'),
    );

    if (lightEntities.length === 1) {
      return lightEntities[0];
    }
  }
}
