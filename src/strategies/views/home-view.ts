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
import { ConfigAreas, createConfigAreas, DeepPartial } from '../../utils';
import { CamerasSectionStrategy } from '../sections/cameras-section';

export type HomeViewStrategyConfig = ConfigAreas;

/**
 * Strategy for the main home view containing floors and system badges.
 */
export class HomeViewStrategy extends ReactiveElement {
  /**
   * Build the view configuration.
   *
   * @param config - User provided partial config.
   * @param hass - Home Assistant connection.
   * @returns The Lovelace view configuration.
   */
  static async generate(
    config: DeepPartial<HomeViewStrategyConfig>,
    hass: Hass,
  ): Promise<LovelaceViewConfig> {
    const home = new Home(hass, this.createConfig(config));

    const [badges, sections] = await Promise.all([
      this.generateBadges(home),
      this.generateSections(home),
    ]);

    return {
      badges,
      sections,
    };
  }

  /**
   * Resolve defaults for the view configuration.
   *
   * @param partialConfig - Partial configuration.
   * @returns Completed configuration.
   */
  static createConfig(
    partialConfig: DeepPartial<HomeViewStrategyConfig>,
  ): HomeViewStrategyConfig {
    return {
      ...createConfigAreas(partialConfig),
    };
  }

  /**
   * Generate all badges shown on the home view.
   *
   * @param home - The home instance.
   * @returns Array of badge configs.
   */
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

    if (home.co2SignalEntity) {
      promises.push(EnergyBadgeStrategy.generate(home.co2SignalEntity));
    }

    if (home.wasteEntity) {
      promises.push(WasteBadgeStrategy.generate(home.wasteEntity));
    }

    return [...(await Promise.all(promises))];
  }

  /**
   * Generate the sections for each floor and camera group.
   *
   * @param home - Home context.
   * @returns List of section configs.
   */
  static async generateSections(
    home: Home,
  ): Promise<LovelaceSectionRawConfig[]> {
    const promises = [];

    const cameraEntities = home.entitiesWithDomains(['camera']);

    if (cameraEntities.length > 0) {
      promises.push(CamerasSectionStrategy.generate(home, cameraEntities));
    }

    for (const floor of home.floors) {
      promises.push(FloorSectionStrategy.generate(floor));
    }

    return [...(await Promise.all(promises))];
  }

  /**
   * Determine the maximum number of columns allowed.
   *
   * @param floors - Floors within the home.
   * @returns The number of columns.
   */
  static maxColumns(floors: Floor[]): number {
    return Math.max(floors.length, 1);
  }
}

customElements.define(
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-home`,
  HomeViewStrategy
);
