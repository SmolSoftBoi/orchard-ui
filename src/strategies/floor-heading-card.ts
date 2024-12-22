import { Hass, HassFloorRegistryEntry } from '../hass';
import { LovelaceBadgeConfig, LovelaceCardConfig } from '../lovelace';

export type FloorHeadingCardStretegyConfig = {
  floor: HassFloorRegistryEntry;
};

export type FloorHeadingCardsStrategyBadgesConfig = {
  floor: HassFloorRegistryEntry;
};

export class FloorHeadingCardStrategy {
  static async generate(
    config: FloorHeadingCardStretegyConfig,
    hass: Hass
  ): Promise<LovelaceCardConfig> {
    return {
      type: 'heading',
      heading: config.floor.name,
      icon: config.floor.icon || undefined,
      tap_action: {
        action: 'navigate',
        navigation_path: `/${config.floor.floor_id}`,
      },
      badges: await this.generateBadges({ floor: config.floor }, hass),
    };
  }

  static async generateBadges(
    config: FloorHeadingCardsStrategyBadgesConfig,
    hass: Hass
  ): Promise<LovelaceBadgeConfig[]> {
    return [];
  }
}
