import { Hass, HassEntityRegistryDisplayEntry } from '../hass';
import { LovelaceBadgeConfig } from '../lovelace';

export type SpeakersTvsBadgeStrategyConfig = {
  entity_id?: string;
};

export class SpeakersTvsBadgeStrategy {
  static homeEntityId =
    'media_player.magic_areas_media_player_groups_global_media_player_group';

  static async generate(
    config: SpeakersTvsBadgeStrategyConfig,
    hass: Hass,
  ): Promise<LovelaceBadgeConfig | undefined> {
    const badge: LovelaceBadgeConfig = {
      type: 'entity',
      entity: config.entity_id || this.homeEntity(hass)?.entity_id,
      name: 'Speakers & TVs',
      icon: 'mdi:television-speaker',
      show_name: true,
    };

    return badge;
  }

  static homeEntity(hass: Hass): HassEntityRegistryDisplayEntry | undefined {
    const homeEntity = hass.entities[this.homeEntityId];

    if (homeEntity) {
      return homeEntity;
    }

    const speakersTvsEntities = Object.values(hass.entities).filter((entity) =>
      entity.entity_id.startsWith('media_player.'),
    );

    if (speakersTvsEntities.length === 1) {
      return speakersTvsEntities[0];
    }
  }
}
