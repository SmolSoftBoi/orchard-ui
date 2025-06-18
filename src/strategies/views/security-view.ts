import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../../config';
import {
  LovelaceBadgeConfig,
  LovelaceSectionRawConfig,
  LovelaceViewConfig,
} from '../../lovelace';
import { Hass } from '../../hass';

/**
 * View strategy displaying security devices.
 */
export class SecurityViewStrategy extends ReactiveElement {
  /**
   * Build the security view configuration.
   *
   * @param config - View configuration object.
   * @param hass - Home Assistant instance.
   * @returns The Lovelace view configuration.
   */
  static async generate(
    config: object,
    hass: Hass,
  ): Promise<LovelaceViewConfig> {
    const view: LovelaceViewConfig = {
      badges: await this.generateBadges(config, hass),
      sections: await this.generateSections(config, hass),
    };

    return view;
  }

  /**
   * Create badges for the security view.
   *
   * @param config - View configuration object.
   * @param hass - Home Assistant instance.
   * @returns Array of badge configs.
   */
  static async generateBadges(
    config: object,
    hass: Hass,
  ): Promise<LovelaceBadgeConfig[]> {
    void config;
    void hass;
    return [];
  }

  /**
   * Build sections for the security view.
   *
   * @param config - View configuration object.
   * @param hass - Home Assistant instance.
   * @returns Section configuration list.
   */
  static async generateSections(
    config: object,
    hass: Hass,
  ): Promise<LovelaceSectionRawConfig[]> {
    void config;
    void hass;
    return [];
  }
}

customElements.define(
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-security`,
  SecurityViewStrategy
);
