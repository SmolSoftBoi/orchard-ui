import {
  Hass,
  HassEntityRegistryDisplayEntry,
  HassFloorRegistryEntry,
} from '../hass';
import { LovelaceBadgeConfig } from '../lovelace';

export type SpeakersTvsBadgeStrategyConfig = {
  floor?: HassFloorRegistryEntry;
};

export type SpeakersTvsBadgeStrategyEntityConfig = {
  floor?: HassFloorRegistryEntry;
};

export type SpeakersTvsBadgeStrategyEntityFloorConfig = {
  floor: HassFloorRegistryEntry;
};

export class SpeakersTvsBadgeStrategy {
  static magicAreasEntityIds = {
    global:
      'media_player.magic_areas_media_player_groups_global_media_player_group',
    floor:
      'media_player.magic_areas_media_player_groups_${floor_id}_media_player_group',
  };

  static async generate(
    config: SpeakersTvsBadgeStrategyConfig,
    hass: Hass
  ): Promise<LovelaceBadgeConfig | undefined> {
    const entity = this.entity({ floor: config.floor }, hass);

    if (!entity) {
      return;
    }

    const badge: LovelaceBadgeConfig = {
      type: 'entity',
      entity: entity.entity_id,
      name: 'Speakers & TVs',
      icon: 'mdi:television-speaker',
      show_name: true,
    };

    return badge;
  }

  static entity(
    config: SpeakersTvsBadgeStrategyEntityConfig,
    hass: Hass
  ): HassEntityRegistryDisplayEntry | undefined {
    if (config.floor) {
      return this.floorEntity({ floor: config.floor }, hass);
    }

    return this.homeEntity(hass);
  }

  static homeEntity(hass: Hass): HassEntityRegistryDisplayEntry | undefined {
    const magicAreasEntity = hass.entities[this.magicAreasEntityIds.global];

    if (magicAreasEntity) {
      return magicAreasEntity;
    }

    const speakersTvsEntities = Object.values(hass.entities).filter((entity) =>
      entity.entity_id.startsWith('media_player.')
    );

    if (speakersTvsEntities.length === 1) {
      return speakersTvsEntities[0];
    }
  }

  static floorEntity(
    config: SpeakersTvsBadgeStrategyEntityFloorConfig,
    hass: Hass
  ): HassEntityRegistryDisplayEntry | undefined {
    const magicAreasEntity =
      hass.entities[
        this.magicAreasEntityIds.floor.replace(
          '${floor_id}',
          config.floor.floor_id
        )
      ];

    if (magicAreasEntity) {
      return magicAreasEntity;
    }

    const speakersTvsEntities = Object.values(hass.entities).filter((entity) =>
      entity.entity_id.startsWith('media_player.')
    );

    const areas = Object.values(hass.areas).filter(
      (area) => area.floor_id === config.floor.floor_id
    );

    const areaSpeakersTvsEntities: HassEntityRegistryDisplayEntry[] = [];

    for (const area of areas) {
      const areaDevices = Object.values(hass.devices).filter(
        (device) => device.area_id === area.area_id
      );

      for (const device of areaDevices) {
        const entity = speakersTvsEntities.find(
          (entity) => entity.device_id === device.id
        );

        if (entity) {
          areaSpeakersTvsEntities.push(entity);
        }
      }
    }

    if (areaSpeakersTvsEntities.length === 1) {
      return areaSpeakersTvsEntities[0];
    }
  }
}
