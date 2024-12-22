import {
  Hass,
  HassEntityRegistryDisplayEntry,
  HassFloorRegistryEntry,
} from '../hass';
import { LovelaceBadgeConfig } from '../lovelace';

export type LightsBadgeStrategyConfig = {
  floor?: HassFloorRegistryEntry;
};

export type LightsBadgeStrategyEntityConfig = {
  floor?: HassFloorRegistryEntry;
};

export type LightsBadgeStrategyFloorEntityConfig = {
  floor: HassFloorRegistryEntry;
};
export class LightsBadgeStrategy {
  static magicAreasEntityIds = {
    global: 'light.magic_areas_light_groups_global',
    floor: 'light.magic_areas_light_groups_${floor_id}',
  };

  static async generate(
    config: LightsBadgeStrategyConfig,
    hass: Hass
  ): Promise<LovelaceBadgeConfig | undefined> {
    const entity = this.entity({ floor: config.floor }, hass);

    if (!entity) {
      return;
    }

    const badge: LovelaceBadgeConfig = {
      type: 'entity',
      entity: entity.entity_id,
      name: 'Lights',
      icon: 'mdi:lightbulb-group',
      show_name: true,
      state_content: ['state'],
    };

    return badge;
  }

  static entity(
    config: LightsBadgeStrategyEntityConfig,
    hass: Hass
  ): HassEntityRegistryDisplayEntry | undefined {
    if (config.floor) {
      return this.floorEntity({ floor: config.floor }, hass);
    }

    return this.homeEntity({}, hass);
  }

  static homeEntity(
    config: object,
    hass: Hass
  ): HassEntityRegistryDisplayEntry | undefined {
    const magicAreaEntity = hass.entities[this.magicAreasEntityIds.global];

    if (magicAreaEntity) {
      return magicAreaEntity;
    }

    const lightEntities = Object.values(hass.entities).filter((entity) =>
      entity.entity_id.startsWith('light.')
    );

    if (lightEntities.length === 1) {
      return lightEntities[0];
    }
  }

  static floorEntity(
    config: LightsBadgeStrategyFloorEntityConfig,
    hass: Hass
  ): HassEntityRegistryDisplayEntry | undefined {
    const magicAreaEntity =
      hass.entities[
        this.magicAreasEntityIds.floor.replace(
          '${floor_id}',
          config.floor.floor_id
        )
      ];

    if (magicAreaEntity) {
      return magicAreaEntity;
    }

    const lightEntities = Object.values(hass.entities).filter((entity) =>
      entity.entity_id.startsWith('light.')
    );

    const areas = Object.values(hass.areas).filter(
      (area) => area.floor_id === config.floor.floor_id
    );

    const areaLightEntities: HassEntityRegistryDisplayEntry[] = [];

    for (const area of areas) {
      areaLightEntities.push(
        ...lightEntities.filter((entity) => entity.area_id === area.area_id)
      );
    }

    if (lightEntities.length === 1) {
      return lightEntities[0];
    }
  }
}
