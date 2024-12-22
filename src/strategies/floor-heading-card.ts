import { Hass } from '../hass';
import { LovelaceCardConfig } from '../lovelace';

export type FloorHeadingCardStretegyConfig = {
  floor_id?: string;
};

export class FloorHeadingCardStrategy {
  static async generate(
    config: FloorHeadingCardStretegyConfig,
    hass: Hass,
  ): Promise<LovelaceCardConfig | undefined> {
    if (!config.floor_id) {
      return;
    }

    const floor = hass.floors[config.floor_id];

    if (!floor) {
      return;
    }

    const card: LovelaceCardConfig = {
      type: 'heading',
      heading: floor.name,
      icon: floor.icon || undefined,
    };

    return card;
  }
}
