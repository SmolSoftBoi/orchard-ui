import { Hass } from '../hass';
import { LovelaceCardConfig, LovelaceSectionRawConfig } from '../lovelace';

export type FloorSectionStrategyConfig = {
  floor_id?: string;
};

export class FloorSectionStrategy {
  static async generate(
    config: FloorSectionStrategyConfig,
    hass: Hass,
  ): Promise<LovelaceSectionRawConfig | undefined> {
    if (!config.floor_id) {
      return {};
    }

    const sections: LovelaceSectionRawConfig = {
      type: 'grid',
      cards: await this.generateCards({}, hass),
    };

    return sections;
  }

  static async generateCards(
    config: object,
    hass: Hass,
  ): Promise<LovelaceCardConfig[]> {
    const cards: LovelaceCardConfig[] = [];

    return cards;
  }
}