import {
  Hass,
  HassEntityRegistryDisplayEntry,
  HassFloorRegistryEntry,
} from '../hass';
import { LovelaceCardConfig, LovelaceSectionRawConfig } from '../lovelace';
import { FloorHeadingCardStrategy } from './floor-heading-card';

export type FloorSectionStrategyConfig = {
  floor: HassFloorRegistryEntry;
};

export type FloorSectionStrategyCardsConfig = {
  floor: HassFloorRegistryEntry;
};

export class FloorSectionStrategy {
  static async generate(
    config: FloorSectionStrategyConfig,
    hass: Hass
  ): Promise<LovelaceSectionRawConfig> {
    return {
      type: 'grid',
      cards: await this.generateCards({ floor: config.floor }, hass),
    };
  }

  static async generateCards(
    config: FloorSectionStrategyCardsConfig,
    hass: Hass
  ): Promise<LovelaceCardConfig[]> {
    const cards: LovelaceCardConfig[] = [
      await FloorHeadingCardStrategy.generate({ floor: config.floor }, hass),
    ];

    const floorEntities: HassEntityRegistryDisplayEntry[] = [];

    const floorAreas = Object.values(hass.areas).filter(
      (area) => area.floor_id === config.floor.floor_id
    );

    for (const area of floorAreas) {
      const areaDevices = Object.values(hass.devices).filter(
        (device) => device.area_id === area.area_id
      );

      for (const device of areaDevices) {
        floorEntities.push(
          ...Object.values(hass.entities).filter(
            (entity) => entity.device_id === device.id
          )
        );
      }

      const lightEntities = floorEntities.filter((entity) =>
        entity.entity_id.startsWith('light.')
      );

      for (const entity of lightEntities) {
        cards.push({
          type: 'tile',
          entity: entity.entity_id,
        });
      }
    }

    return cards;
  }
}
