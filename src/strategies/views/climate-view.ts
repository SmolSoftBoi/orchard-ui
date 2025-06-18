import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../../config';
import {
  LovelaceBadgeConfig,
  LovelaceSectionRawConfig,
  LovelaceViewConfig,
} from '../../lovelace';
import { Hass } from '../../hass';
import { Home } from '@smolpack/hasskit';

/**
 * View strategy for displaying climate devices.
 */
export class ClimateViewStrategy extends ReactiveElement {
  /**
   * Build the climate view configuration.
   *
   * @param config - View configuration object.
   * @param hass - Home Assistant instance.
   * @returns The view configuration.
   */
  static async generate(
    config: object,
    hass: Hass,
  ): Promise<LovelaceViewConfig> {
    const home = new Home(hass);

    const promises = [this.generateBadges(home), this.generateSections(home)];

    const [badges, sections] = await Promise.all(promises);

    return {
      badges: badges,
      sections: sections,
    };
  }

  /**
   * Generate badges for the climate view.
   *
   * @param home - Representation of the home.
   * @returns Array of badge configs.
   */
  static async generateBadges(home: Home): Promise<LovelaceBadgeConfig[]> {
    void home;
    return [];
  }

  /**
   * Build the sections for the climate view.
   *
   * @param home - Representation of the home.
   * @returns Section configuration array.
   */
  static async generateSections(
    home: Home,
  ): Promise<LovelaceSectionRawConfig[]> {
    void home;
    return [];
  }
}

customElements.define(
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-climate`,
  ClimateViewStrategy
);
