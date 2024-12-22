import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../config';
import {
  LovelaceBadgeConfig,
  LovelaceSectionRawConfig,
  LovelaceViewConfig,
} from '../lovelace';
import { Hass } from '../hass';

type LightsViewStrategyConfig = {};

export class LightsViewStrategy extends ReactiveElement {
  static async generate(
    config: LightsViewStrategyConfig,
    hass: Hass
  ): Promise<LovelaceViewConfig> {
    const view: LovelaceViewConfig = {
      badges: await this.generateBadges(config, hass),
      sections: await this.generateSections(config, hass),
    };

    return view;
  }

  static async generateBadges(
    config: LightsViewStrategyConfig,
    hass: Hass
  ): Promise<LovelaceBadgeConfig[]> {
    return [];
  }

  static async generateSections(
    config: LightsViewStrategyConfig,
    hass: Hass
  ): Promise<LovelaceSectionRawConfig[]> {
    return [];
  }
}

customElements.define(
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-lights`,
  LightsViewStrategy
);
