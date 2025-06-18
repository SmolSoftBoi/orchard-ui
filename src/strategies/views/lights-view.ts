import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../../config';
import {
  LovelaceBadgeConfig,
  LovelaceSectionRawConfig,
  LovelaceViewConfig,
} from '../../lovelace';
import { Hass } from '../../hass';

export class LightsViewStrategy extends ReactiveElement {
  static async generate(
    config: object,
    hass: Hass
  ): Promise<LovelaceViewConfig> {
    const [badges, sections] = await Promise.all([
      this.generateBadges(config, hass),
      this.generateSections(config, hass),
    ]);

    return {
      badges: badges,
      sections: sections,
    };
  }

  static async generateBadges(
    config: object,
    hass: Hass
  ): Promise<LovelaceBadgeConfig[]> {
    void config;
    void hass;
    return [];
  }

  static async generateSections(
    config: object,
    hass: Hass
  ): Promise<LovelaceSectionRawConfig[]> {
    void config;
    void hass;
    return [];
  }
}

customElements.define(
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-lights`,
  LightsViewStrategy
);
