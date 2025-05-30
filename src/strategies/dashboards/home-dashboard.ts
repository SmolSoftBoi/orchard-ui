import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME, NAME } from '../../config';
import { Hass } from '../../hass';
import { LovelaceConfig, LovelaceViewRawConfig } from '../../lovelace';
import { AutomationsViewStrategy } from '../views/automations-view';
import { HomeViewStrategy, HomeViewStrategyConfig } from '../views/home-view';
import { Home } from '@smolpack/hasskit';
import { DeepPartial } from '../../utils';

export type HomeDashboardStrategyConfig = HomeViewStrategyConfig;

export class HomeDashboardStrategy extends ReactiveElement {
  static logPrefix = `${NAME} - Home Dashboard Strategy`;

  static async generate(
    partialConfig: DeepPartial<HomeDashboardStrategyConfig>,
    hass: Hass
  ): Promise<LovelaceConfig> {
    const config = this.createConfig(partialConfig);
    const home = new Home(hass, config);

    console.info(this.logPrefix, 'Config', config);
    console.info(this.logPrefix, 'Home', home);

    return {
      views: await this.generateViews(home, config),
    };
  }

  static createConfig(
    partialConfig: DeepPartial<HomeDashboardStrategyConfig>
  ): HomeDashboardStrategyConfig {
    return HomeViewStrategy.createConfig(partialConfig);
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
          ...config,
        },
      },
      {
        type: 'sections',
        title: 'Climate',
        path: 'climate',
        icon: home.climateEntity?.icon || 'mdi:fan',
        strategy: {
          type: `custom:${CUSTOM_ELEMENT_NAME}-climate`,
          ...config,
        },
      },
      {
        type: 'sections',
        title: 'Lights',
        path: 'lights',
        icon: home.lightEntity?.icon || 'mdi:lightbulb-group',
        strategy: {
          type: `custom:${CUSTOM_ELEMENT_NAME}-lights`,
          ...config,
        },
      },
      {
        type: 'sections',
        title: 'Security',
        path: 'security',
        icon: home.lockEntity?.icon || 'mdi:lock',
        strategy: {
          type: `custom:${CUSTOM_ELEMENT_NAME}-security`,
          ...config,
        },
      },
      {
        type: 'sections',
        title: 'Speakers & TVs',
        path: 'speakers-tvs',
        icon: home.mediaPlayerEntity?.icon || 'mdi:television-speaker',
        strategy: {
          type: `custom:${CUSTOM_ELEMENT_NAME}-speakers-tvs`,
          ...config,
        },
      },
    ];

    return views;
  }
}

customElements.define(
  `ll-strategy-${CUSTOM_ELEMENT_NAME}-home`,
  HomeDashboardStrategy
);
