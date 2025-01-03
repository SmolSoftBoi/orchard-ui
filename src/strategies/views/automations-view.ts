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

export class AutomationsViewStrategy extends ReactiveElement {
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
    const sections: LovelaceSectionRawConfig = [
      await AutomationSectionStrategy.generate({}, hass),
    ];

    for (const floor of Object.values(hass.floors)) {
      sections.push(
        await AutomationSectionStrategy.generate({ floor: floor }, hass)
      );
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
