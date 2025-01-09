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

export class AutomationsViewStrategy extends ReactiveElement {
  static async generate(
    partialConfig: AutomationsViewStrategyConfig,
    hass: Hass
  ): Promise<LovelaceViewConfig> {
    const config = this.createConfig(partialConfig);
    const home = new Home(hass, config);

    const view: LovelaceViewConfig = {
      badges: await this.generateBadges(),
      sections: await this.generateSections(home),
    };

    return view;
  }

  static createConfig(
    partialConfig: AutomationsViewStrategyConfig
  ): AutomationsViewStrategyConfig {
    return {
      ...createConfigAreas(partialConfig),
    };
  }

  static async generateBadges(): Promise<LovelaceBadgeConfig[]> {
    return [];
  }

  static async generateSections(
    home: Home
  ): Promise<LovelaceSectionRawConfig[]> {
    const sections: LovelaceSectionRawConfig = [
      await AutomationSectionStrategy.generate(home),
    ];

    for (const floor of home.floors) {
      sections.push(await AutomationSectionStrategy.generate(home, floor));
    }

    return sections;
  }

  static maxColumns(home: Home): number {
    let maxColumns = 1;

    for (const floor of home.zones) {
      for (const area of floor.rooms) {
        const areaAutomationEntities = area.entitiesWithDomains(['automation']);

        if (areaAutomationEntities.length > 0) {
          maxColumns = maxColumns++;
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
