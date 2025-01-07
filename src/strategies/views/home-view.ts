import { ReactiveElement } from 'lit';
import { Home, Floor } from '@smolpack/hasskit';
import { CUSTOM_ELEMENT_NAME } from '../../config';
import {
  LovelaceBadgeConfig,
  LovelaceSectionRawConfig,
  LovelaceViewConfig,
} from '../../lovelace';
import { Hass } from '../../hass';
import { ClimateBadgeStrategy } from '../badges/climate-badge';
import { WeatherBadgeStrategy } from '../badges/weather-badge';
import { LightsBadgeStrategy } from '../badges/lights-badge';
import { SecurityBadgeStrategy } from '../badges/security-badge';
import { SpeakersTvsBadgeStrategy } from '../badges/speakers-tvs-badge';
import { FloorSectionStrategy } from '../sections/floor-section';
import { WasteBadgeStrategy } from '../badges/waste-badge';
import { EnergyBadgeStrategy } from '../badges/energy-badge';

export type HomeViewStrategyConfig = {
  rooms: HomeViewStrategyConfigRoom[];
};

type HomeViewStrategyConfigRoom = {
  id: string;
};

export class HomeViewStrategy extends ReactiveElement {
  static async generate(
    config: Partial<HomeViewStrategyConfig>,
    hass: Hass
  ): Promise<LovelaceViewConfig> {
    const home = new Home(hass, this.config(config));

    const promises = [this.generateBadges(home), this.generateSections(home)];

    const [badges, sections] = await Promise.all(promises);

    return {
      badges,
      sections,
    };
  }

  static async generateBadges(home: Home): Promise<LovelaceBadgeConfig[]> {
    const promises = [];

    if (home.weatherEntity) {
      promises.push(WeatherBadgeStrategy.generate(home.weatherEntity));
    }

    if (home.climateEntity) {
      promises.push(ClimateBadgeStrategy.generate(home.climateEntity));
    }

    if (home.lightEntity) {
      promises.push(LightsBadgeStrategy.generate(home.lightEntity));
    }

    if (home.lockEntity) {
      promises.push(SecurityBadgeStrategy.generate(home.lockEntity));
    }

    if (home.mediaPlayerEntity) {
      promises.push(SpeakersTvsBadgeStrategy.generate(home.mediaPlayerEntity));
    }

    if (home.c02SignalEntity) {
      promises.push(EnergyBadgeStrategy.generate(home.c02SignalEntity));
    }

    if (home.wasteEntity) {
      promises.push(WasteBadgeStrategy.generate(home.wasteEntity));
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

  static config(
    partialConfig: Partial<HomeViewStrategyConfig>
  ): HomeViewStrategyConfig {
    const config: HomeViewStrategyConfig = {
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
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-home`,
  HomeViewStrategy
);
