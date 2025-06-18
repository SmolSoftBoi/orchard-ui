import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../../config';
import {
  LovelaceBadgeConfig,
  LovelaceSectionRawConfig,
  LovelaceViewConfig,
} from '../../lovelace';
import { Hass } from '../../hass';

type RoomViewStrategyConfig = {
  area_id?: string;
};

export class RoomViewStrategy extends ReactiveElement {
  static async generate(
    config: RoomViewStrategyConfig,
    hass: Hass
  ): Promise<LovelaceViewConfig> {
    const view: LovelaceViewConfig = {
      badges: await this.generateBadges(config, hass),
      sections: await this.generateSections(config, hass),
    };

    return view;
  }

  static async generateBadges(
    config: RoomViewStrategyConfig,
    hass: Hass
  ): Promise<LovelaceBadgeConfig[]> {
    void config;
    void hass;
    return [];
  }

  static async generateSections(
    config: RoomViewStrategyConfig,
    hass: Hass
  ): Promise<LovelaceSectionRawConfig[]> {
    void config;
    void hass;
    return [];
  }
}

customElements.define(
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-room`,
  RoomViewStrategy
);
