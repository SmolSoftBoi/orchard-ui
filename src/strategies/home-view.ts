import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../config';
import {
  LovelaceBadgeConfig,
  LovelaceSectionRawConfig,
  LovelaceViewConfig,
} from '../lovelace';
import { Hass } from '../hass';
import { ClimateBadgeStrategy } from './climate-badge';
import { WeatherBadgeStrategy } from './weather-badge';
import { LightsBadgeStrategy } from './lights-badge';
import { SecurityBadgeStrategy } from './security-badge';
import { SpeakersTvsBadgeStrategy } from './speakers-tvs-badge';

type HomeViewStrategyConfig = {};

export class HomeViewStrategy extends ReactiveElement {
  static async generate(
    config: HomeViewStrategyConfig,
    hass: Hass,
  ): Promise<LovelaceViewConfig> {
    const view: LovelaceViewConfig = {
      badges: await this.generateBadges(config, hass),
      sections: await this.generateSections(config, hass),
    };

    return view;
  }

  static async generateBadges(
    config: HomeViewStrategyConfig,
    hass: Hass,
  ): Promise<LovelaceBadgeConfig[]> {
    const badges: LovelaceBadgeConfig[] = [];

    const weatherBadge = await WeatherBadgeStrategy.generate({}, hass);
    const climateBadge = await ClimateBadgeStrategy.generate({}, hass);
    const lightsBadge = await LightsBadgeStrategy.generate({}, hass);
    const securtyBadge = await SecurityBadgeStrategy.generate({}, hass);
    const speakersTvsBadge = await SpeakersTvsBadgeStrategy.generate({}, hass);

    if (weatherBadge) {
      badges.push(weatherBadge);
    }

    if (climateBadge) {
      badges.push(climateBadge);
    }

    if (lightsBadge) {
      badges.push(lightsBadge);
    }

    if (securtyBadge) {
      badges.push(securtyBadge);
    }

    if (speakersTvsBadge) {
      badges.push(speakersTvsBadge);
    }

    return badges;
  }

  static async generateSections(
    config: HomeViewStrategyConfig,
    hass: Hass,
  ): Promise<LovelaceSectionRawConfig[]> {
    const sections: LovelaceSectionRawConfig[] = [];

    return sections;
  }
}

customElements.define(
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-home`,
  HomeViewStrategy,
);
