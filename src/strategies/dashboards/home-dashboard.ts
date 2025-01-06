import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../../config';
import { Hass } from '../../hass';
import { LovelaceConfig, LovelaceViewRawConfig } from '../../lovelace';
import { AutomationsViewStrategy } from '../views/automations-view';
import { HomeViewStrategy, HomeViewStrategyConfig } from '../views/home-view';
import { Home } from '@smolpack/hasskit';

export type HomeDashboardStrategyConfig = HomeViewStrategyConfig;

export class HomeDashboardStrategy extends ReactiveElement {
  static async generate(
    partialConfig: Partial<HomeDashboardStrategyConfig>,
    hass: Hass
  ): Promise<LovelaceConfig> {
    const config = this.config(partialConfig);
    const home = new Home(hass, this.config(config));

    return {
      views: await this.generateViews(home, config),
    };
  }

  static async generateViews(
    home: Home,
    config: HomeDashboardStrategyConfig
  ): Promise<LovelaceViewRawConfig[]> {
    const views = [
      {
        type: 'sections',
        title: 'Home',
        path: 'home',
        icon: 'mdi:home',
        max_columns: HomeViewStrategy.maxColumns(home.zones),
        strategy: {
          type: `custom:${CUSTOM_ELEMENT_NAME}-home`,
          ...config,
        },
      },
      {
        type: 'sections',
        title: 'Automations',
        icon: 'mdi:alarm',
        max_columns: AutomationsViewStrategy.maxColumns(home),
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

    return views;
  }

  static config(
    partialConfig: Partial<HomeDashboardStrategyConfig>
  ): HomeDashboardStrategyConfig {
    const config: HomeDashboardStrategyConfig = {
      rooms: [],
    };

    if (partialConfig.rooms) {
      for (const room of partialConfig.rooms.filter((room) => room.id)) {
        config.rooms.push({
          id: room.id,
        });
      }
    }

    return config;
  }
}

customElements.define(
  `ll-strategy-${CUSTOM_ELEMENT_NAME}-home`,
  HomeDashboardStrategy
);
