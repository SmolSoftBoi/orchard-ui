import { Hass, HassFloorRegistryEntry } from '../hass';
import { LovelaceBadgeConfig, LovelaceCardConfig } from '../lovelace';
import { ClimateBadgeStrategy } from './climate-badge';
import { LightsBadgeStrategy } from './lights-badge';
import { SecurityBadgeStrategy } from './security-badge';
import { SpeakersTvsBadgeStrategy } from './speakers-tvs-badge';

export type FloorHeadingCardStretegyConfig = {
  floor: HassFloorRegistryEntry;
};

export type FloorHeadingCardsStrategyBadgesConfig = {
  floor: HassFloorRegistryEntry;
};

export class FloorHeadingCardStrategy {
  static async generate(
    config: FloorHeadingCardStretegyConfig,
    hass: Hass
  ): Promise<LovelaceCardConfig> {
    return {
      type: 'heading',
      heading: config.floor.name,
      icon: config.floor.icon || undefined,
      tap_action: {
        action: 'navigate',
        navigation_path: `/${config.floor.floor_id}`,
      },
      badges: await this.generateBadges({ floor: config.floor }, hass),
    };
  }

  static async generateBadges(
    config: FloorHeadingCardsStrategyBadgesConfig,
    hass: Hass
  ): Promise<LovelaceBadgeConfig[]> {
    const badges: LovelaceBadgeConfig[] = [];

    const [climateBadge, lightBadge, securityBadge, speakersTvsEntities] =
      await Promise.all([
        ClimateBadgeStrategy.generate({ floor: config.floor }, hass),
        LightsBadgeStrategy.generate({ floor: config.floor }, hass),
        SecurityBadgeStrategy.generate({ floor: config.floor }, hass),
        SpeakersTvsBadgeStrategy.generate({ floor: config.floor }, hass),
      ]);

    if (climateBadge) {
      badges.push(climateBadge);
    }

    if (lightBadge) {
      badges.push(lightBadge);
    }

    if (securityBadge) {
      badges.push(securityBadge);
    }

    if (speakersTvsEntities) {
      badges.push(speakersTvsEntities);
    }

    return badges;
  }
}
