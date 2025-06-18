import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../../config';
import {
  LovelaceBadgeConfig,
  LovelaceSectionRawConfig,
  LovelaceViewConfig,
} from '../../lovelace';
import { Hass } from '../../hass';

type FloorViewStrategyConfig = {
  floor_id?: string;
};

export class FloorViewStrategy extends ReactiveElement {
  static async generate(
    config: FloorViewStrategyConfig,
    hass: Hass
  ): Promise<LovelaceViewConfig> {
    if (!config.floor_id) {
      return {};
    }

    const view: LovelaceViewConfig = {
      badges: await this.generateBadges(config, hass),
      sections: await this.generateSections(config, hass),
    };

    return view;
  }

  static async generateBadges(
    config: FloorViewStrategyConfig,
    hass: Hass
  ): Promise<LovelaceBadgeConfig[]> {
    void config;
    void hass;
    return [];
  }

  static async generateSections(
    config: FloorViewStrategyConfig,
    hass: Hass
  ): Promise<LovelaceSectionRawConfig[]> {
    void config;
    void hass;
    return [];
  }
}

customElements.define(
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-floor`,
  FloorViewStrategy
);
