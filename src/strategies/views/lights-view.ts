import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../../config';
import {
  LovelaceBadgeConfig,
  LovelaceSectionRawConfig,
  LovelaceViewConfig,
} from '../../lovelace';
import { Hass } from '../../hass';

/**
 * Render a view listing all lights.
 */
export class LightsViewStrategy extends ReactiveElement {
  /**
   * Build the lights view.
   *
   * @param config - View configuration object.
   * @param hass - Home Assistant instance.
   * @returns The Lovelace view configuration.
   */
  static async generate(
    config: object,
    hass: Hass,
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

  /**
   * Produce the badges for the lights view.
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
   * Generate section configurations for the lights view.
   *
   * @param config - View configuration object.
   * @param hass - Home Assistant instance.
   * @returns List of section configs.
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
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-lights`,
  LightsViewStrategy
);
