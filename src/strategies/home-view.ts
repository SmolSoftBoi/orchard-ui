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
import { FloorSectionStrategy } from './floor-section';
import { Floor, Home } from '../home';

export class HomeViewStrategy extends ReactiveElement {
  static async generate(
    config: object,
    hass: Hass
  ): Promise<LovelaceViewConfig> {
    const home = new Home(hass);

    const promises = [this.generateBadges(home), this.generateSections(home)];

    const [badges, sections] = await Promise.all(promises);

    return {
      badges,
      sections,
    };
  }

  static async generateBadges(home: Home): Promise<LovelaceBadgeConfig[]> {
    const promises = [];

    if (home.weatherService) {
      promises.push(WeatherBadgeStrategy.generate(home.weatherService));
    }

    if (home.climateService) {
      promises.push(ClimateBadgeStrategy.generate(home.climateService));
    }

    if (home.lightService) {
      promises.push(LightsBadgeStrategy.generate(home.lightService));
    }

    if (home.securityService) {
      promises.push(SecurityBadgeStrategy.generate(home.securityService));
    }

    if (home.speakersTvsService) {
      promises.push(SpeakersTvsBadgeStrategy.generate(home.speakersTvsService));
    }

    return [...(await Promise.all(promises))];
  }

  static async generateSections(
    home: Home
  ): Promise<LovelaceSectionRawConfig[]> {
    const promises = [];

    for (const floor of home.floors) {
      promises.push(FloorSectionStrategy.generate(floor));
    }

    return [...(await Promise.all(promises))];
  }

  static maxColumns(floors: Floor[]): number {
    return Math.max(floors.length, 1);
  }
}

customElements.define(
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-home`,
  HomeViewStrategy
);
