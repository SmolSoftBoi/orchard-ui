import { HassFloorRegistryEntry } from '../../hass';
import Floor from '../../home/floor';
import { LovelaceBadgeConfig, LovelaceCardConfig } from '../../lovelace';
import { ClimateBadgeStrategy } from '../badges/climate-badge';
import { LightsBadgeStrategy } from '../badges/lights-badge';
import { SecurityBadgeStrategy } from '../badges/security-badge';
import { SpeakersTvsBadgeStrategy } from '../badges/speakers-tvs-badge';

export type FloorHeadingCardStretegyConfig = {
  floor: HassFloorRegistryEntry;
};

export type FloorHeadingCardsStrategyBadgesConfig = {
  floor: HassFloorRegistryEntry;
};

export class FloorHeadingCardStrategy {
  static async generate(floor: Floor): Promise<LovelaceCardConfig> {
    return {
      type: 'heading',
      heading: floor.name,
      icon: floor.icon || undefined,
      tap_action: {
        action: 'navigate',
        navigation_path: `/${floor.id}`,
      },
      badges: await this.generateBadges(floor),
    };
  }

  static async generateBadges(floor: Floor): Promise<LovelaceBadgeConfig[]> {
    const promises = [];

    if (floor.climateService) {
      promises.push(ClimateBadgeStrategy.generate(floor.climateService));
    }

    if (floor.lightService) {
      promises.push(LightsBadgeStrategy.generate(floor.lightService));
    }

    if (floor.securityService) {
      promises.push(SecurityBadgeStrategy.generate(floor.securityService));
    }

    if (floor.speakersTvsService) {
      promises.push(
        SpeakersTvsBadgeStrategy.generate(floor.speakersTvsService)
      );
    }

    return [...(await Promise.all(promises))];
  }
}
