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
import { EnergyBadgeStrategy } from './energy-badge';

export class HomeViewStrategy extends ReactiveElement {
  static async generate(
    config: object,
    hass: Hass
  ): Promise<LovelaceViewConfig> {
    const [badges, sections] = await Promise.all([
      this.generateBadges(config, hass),
      this.generateSections(config, hass),
    ]);

    return {
      badges,
      sections,
    };
  }

  static async generateBadges(
    config: object,
    hass: Hass
  ): Promise<LovelaceBadgeConfig[]> {
    const badges: LovelaceBadgeConfig[] = [];

    const [
      weatherBadge,
      climateBadge,
      lightsBadge,
      securtyBadge,
      speakersTvsBadge,
      energyBadge,
    ] = await Promise.all([
      WeatherBadgeStrategy.generate({}, hass),
      ClimateBadgeStrategy.generate({}, hass),
      LightsBadgeStrategy.generate({}, hass),
      SecurityBadgeStrategy.generate({}, hass),
      SpeakersTvsBadgeStrategy.generate({}, hass),
      EnergyBadgeStrategy.generate({}, hass),
    ]);

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

    if (energyBadge) {
      badges.push(energyBadge);
    }

    return badges;
  }

  static async generateSections(
    config: object,
    hass: Hass
  ): Promise<LovelaceSectionRawConfig[]> {
    const sections: LovelaceSectionRawConfig[] = [];

    for (const floor of Object.values(hass.floors)) {
      const section = await FloorSectionStrategy.generate(
        { floor: floor },
        hass
      );

      if (section) {
        sections.push(section);
      }
    }

    return sections;
  }

  static maxColumns(config: object, hass: Hass): number {
    return Math.max(Object.keys(hass.floors).length, 1);
  }
}

customElements.define(
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-home`,
  HomeViewStrategy
);
