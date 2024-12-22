import { Hass, HassFloorRegistryEntry } from '../hass';
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
    return [
      await FloorHeadingCardStrategy.generate({ floor: config.floor }, hass),
    ];
  }
}
