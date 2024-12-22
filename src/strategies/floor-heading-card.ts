import { Hass, HassFloorRegistryEntry } from '../hass';
import { LovelaceCardConfig } from '../lovelace';

export type FloorHeadingCardStretegyConfig = {
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
    };
  }
}
