import {
  Hass,
  HassEntityRegistryDisplayEntry,
  HassFloorRegistryEntry,
} from '../hass';
import { LovelaceBadgeConfig } from '../lovelace';

export type ClimateBadgeStrategyConfig = {
  floor?: HassFloorRegistryEntry;
};

export type ClimateBadgeStrategyEntityConfig = {
  floor?: HassFloorRegistryEntry;
};

export type ClimateBadgeStrategyFloorEntityConfig = {
  floor: HassFloorRegistryEntry;
};

export class ClimateBadgeStrategy {
  static magicAreasEntityIds = {
    global: 'climate.magic_areas_climate_groups_global_climate_group',
    floor: 'climate.magic_areas_climate_groups_${floor_id}_climate_group',
  };

  static async generate(
    config: ClimateBadgeStrategyConfig,
    hass: Hass
  ): Promise<LovelaceBadgeConfig | undefined> {
    const entity = this.entity(config, hass);

    if (!entity) {
      return;
    }

    return {
      type: 'entity',
      entity: entity.entity_id,
      name: 'Climate',
      icon: 'mdi:fan',
      show_name: true,
    };
  }

  static entity(
    config: ClimateBadgeStrategyEntityConfig,
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

    const climateEntities = Object.values(hass.entities).filter((entity) =>
      entity.entity_id.startsWith('climate.')
    );

    if (climateEntities.length === 1) {
      return climateEntities[0];
    }
  }

  static floorEntity(
    config: ClimateBadgeStrategyFloorEntityConfig,
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

    const climateEntities = Object.values(hass.entities).filter((entity) =>
      entity.entity_id.startsWith('climate.')
    );

    const areas = Object.values(hass.areas).filter(
      (area) => area.floor_id === config.floor.floor_id
    );

    const areaClimateEntities: HassEntityRegistryDisplayEntry[] = [];

    for (const area of areas) {
      areaClimateEntities.push(
        ...climateEntities.filter((entity) => entity.area_id === area.area_id)
      );
    }

    if (areaClimateEntities.length === 1) {
      return climateEntities[0];
    }
  }
}
