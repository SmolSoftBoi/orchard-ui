import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../config';
import { Hass } from '../hass';
import { LovelaceConfig, LovelaceViewRawConfig } from '../lovelace';
import { AutomationsViewStrategy } from './automations-view';
import { HomeViewStrategy } from './home-view';

export class HomeDashboardStrategy extends ReactiveElement {
  static async generate(config: object, hass: Hass): Promise<LovelaceConfig> {
    return {
      views: await this.generateViews(config, hass),
    };
  }

  static async generateViews(
    config: object,
    hass: Hass
  ): Promise<LovelaceViewRawConfig[]> {
    return [
      {
        type: 'sections',
        title: 'Home',
        path: 'home',
        icon: 'mdi:home',
        max_columns: HomeViewStrategy.maxColumns({}, hass),
        strategy: {
          type: `custom:${CUSTOM_ELEMENT_NAME}-home`,
        },
      },
      {
        type: 'sections',
        title: 'Automations',
        icon: 'mdi:alarm',
        max_columns: AutomationsViewStrategy.maxColumns({}, hass),
        strategy: {
          type: `custom:${CUSTOM_ELEMENT_NAME}-automations`,
        },
      },
      {
        type: 'sections',
        title: 'Climate',
        path: 'climate',
        icon: 'mdi:fan',
        strategy: {
          type: `custom:${CUSTOM_ELEMENT_NAME}-climate`,
        },
      },
      {
        type: 'sections',
        title: 'Lights',
        path: 'lights',
        icon: 'mdi:lightbulb-group',
        strategy: {
          type: `custom:${CUSTOM_ELEMENT_NAME}-lights`,
        },
      },
      {
        type: 'sections',
        title: 'Security',
        path: 'security',
        icon: 'mdi:lock',
        strategy: {
          type: `custom:${CUSTOM_ELEMENT_NAME}-security`,
        },
      },
      {
        type: 'sections',
        title: 'Speakers & TVs',
        path: 'speakers-tvs',
        icon: 'mdi:television-speaker',
        strategy: {
          type: `custom:${CUSTOM_ELEMENT_NAME}-speakers-tvs`,
        },
      },
    ];
  }
}

customElements.define(
  `ll-strategy-${CUSTOM_ELEMENT_NAME}-home`,
  HomeDashboardStrategy
);
