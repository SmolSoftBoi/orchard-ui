import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../../config';
import {
  LovelaceBadgeConfig,
  LovelaceSectionRawConfig,
  LovelaceViewConfig,
} from '../../lovelace';
import { Hass } from '../../hass';

export class SecurityViewStrategy extends ReactiveElement {
  static async generate(
    config: object,
    hass: Hass
  ): Promise<LovelaceViewConfig> {
    const view: LovelaceViewConfig = {
      badges: await this.generateBadges(config, hass),
      sections: await this.generateSections(config, hass),
    };

    return view;
  }

  static async generateBadges(
    config: object,
    hass: Hass
  ): Promise<LovelaceBadgeConfig[]> {
    return [];
  }

  static async generateSections(
    config: object,
    hass: Hass
  ): Promise<LovelaceSectionRawConfig[]> {
    return [];
  }
}

customElements.define(
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-security`,
  SecurityViewStrategy
);
