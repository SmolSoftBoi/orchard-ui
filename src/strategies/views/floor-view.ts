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

/**
 * Strategy for rendering a single floor view.
 */
export class FloorViewStrategy extends ReactiveElement {
  /**
   * Build the view representing one floor.
   *
   * @param config - View configuration.
   * @param hass - Home Assistant instance.
   * @returns The view configuration.
   */
  static async generate(
    config: FloorViewStrategyConfig,
    hass: Hass,
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

  /**
   * Generate badges shown at the top of the floor view.
   *
   * @param config - View configuration.
   * @param hass - Home Assistant instance.
   * @returns Badge configuration array.
   */
  static async generateBadges(
    config: FloorViewStrategyConfig,
    hass: Hass,
  ): Promise<LovelaceBadgeConfig[]> {
    void config;
    void hass;
    return [];
  }

  /**
   * Build the sections for the floor view.
   *
   * @param config - View configuration.
   * @param hass - Home Assistant instance.
   * @returns Section configuration array.
   */
  static async generateSections(
    config: FloorViewStrategyConfig,
    hass: Hass,
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
