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

/**
 * Strategy to show devices and information for a single room.
 */
export class RoomViewStrategy extends ReactiveElement {
  /**
   * Build the room view.
   *
   * @param config - Room view configuration.
   * @param hass - Home Assistant instance.
   * @returns Lovelace view configuration.
   */
  static async generate(
    config: RoomViewStrategyConfig,
    hass: Hass,
  ): Promise<LovelaceViewConfig> {
    const view: LovelaceViewConfig = {
      badges: await this.generateBadges(config, hass),
      sections: await this.generateSections(config, hass),
    };

    return view;
  }

  /**
   * Create badges for the room view.
   *
   * @param config - Room view configuration.
   * @param hass - Home Assistant instance.
   * @returns Array of badge configs.
   */
  static async generateBadges(
    config: RoomViewStrategyConfig,
    hass: Hass,
  ): Promise<LovelaceBadgeConfig[]> {
    void config;
    void hass;
    return [];
  }

  /**
   * Build the sections for the room view.
   *
   * @param config - Room view configuration.
   * @param hass - Home Assistant instance.
   * @returns Section configuration list.
   */
  static async generateSections(
    config: RoomViewStrategyConfig,
    hass: Hass,
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
