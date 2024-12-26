import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../config';
import {
  LovelaceBadgeConfig,
  LovelaceSectionRawConfig,
  LovelaceViewConfig,
} from '../lovelace';
import { Hass } from '../hass';
import { Home } from '../home';

export class ClimateViewStrategy extends ReactiveElement {
  static async generate(
    config: object,
    hass: Hass
  ): Promise<LovelaceViewConfig> {
    const home = new Home(hass);

    const promises = [this.generateBadges(home), this.generateSections(home)];

    const [badges, sections] = await Promise.all(promises);

    return {
      badges: badges,
      sections: sections,
    };
  }

  static async generateBadges(home: Home): Promise<LovelaceBadgeConfig[]> {
    return [];
  }

  static async generateSections(
    home: Home
  ): Promise<LovelaceSectionRawConfig[]> {
    return [];
  }
}

customElements.define(
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-climate`,
  ClimateViewStrategy
);
