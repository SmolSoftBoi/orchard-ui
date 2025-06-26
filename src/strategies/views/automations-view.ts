import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../../config';
import {
  LovelaceBadgeConfig,
  LovelaceSectionRawConfig,
  LovelaceViewConfig,
} from '../../lovelace';
import { Hass } from '../../hass';
import { AutomationSectionStrategy } from '../sections/automations-section';
import { Home } from '@smolpack/hasskit';
import { ConfigAreas, createConfigAreas } from '../../utils';

export type AutomationsViewStrategyConfig = ConfigAreas;

/**
 * Show automations grouped by floor and area.
 */
export class AutomationsViewStrategy extends ReactiveElement {
  /**
   * Build the automations view.
   *
   * @param partialConfig - Partial configuration from the dashboard.
   * @param hass - Home Assistant instance.
   * @returns Lovelace view configuration.
   */
  static async generate(
    partialConfig: AutomationsViewStrategyConfig,
    hass: Hass,
  ): Promise<LovelaceViewConfig> {
    const config = this.createConfig(partialConfig);
    const home = new Home(hass, config);

    const view: LovelaceViewConfig = {
      badges: await this.generateBadges(),
      sections: await this.generateSections(home),
    };

    return view;
  }

  /**
   * Normalize the automations view config.
   *
   * @param partialConfig - Partial configuration.
   * @returns Completed configuration.
   */
  static createConfig(
    partialConfig: AutomationsViewStrategyConfig,
  ): AutomationsViewStrategyConfig {
    return {
      ...createConfigAreas(partialConfig),
    };
  }

  /**
   * Currently there are no badges for the automations view.
   *
   * @returns Empty array of badges.
   */
  static async generateBadges(): Promise<LovelaceBadgeConfig[]> {
    return [];
  }

  /**
   * Create automation sections for home and each floor.
   *
   * @param home - Home context.
   * @returns Array of section configs.
   */
  static async generateSections(
    home: Home,
  ): Promise<LovelaceSectionRawConfig[]> {
    const sections: LovelaceSectionRawConfig = [
      await AutomationSectionStrategy.generate(home),
    ];

    for (const floor of home.floors) {
      sections.push(await AutomationSectionStrategy.generate(home, floor));
    }

    return sections;
  }

  /**
   * Determine column count for the view grid.
   *
   * @param home - Home context.
   * @returns Number of columns.
   */
  static maxColumns(home: Home): number {
    let maxColumns = 1;

    for (const floor of home.zones) {
      for (const area of floor.rooms) {
        const areaAutomationEntities = area.entitiesWithDomains(['automation']);

        if (areaAutomationEntities.length > 0) {
          maxColumns += 1;
          break;
        }
      }
    }

    return maxColumns;
  }
}

customElements.define(
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-automations`,
  AutomationsViewStrategy
);
