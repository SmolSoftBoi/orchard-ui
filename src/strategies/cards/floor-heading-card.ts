import { Floor } from '@smolpack/hasskit';
import { LovelaceBadgeConfig, LovelaceCardConfig } from '../../lovelace';
import { ClimateBadgeStrategy } from '../badges/climate-badge';
import { LightsBadgeStrategy } from '../badges/lights-badge';
import { SecurityBadgeStrategy } from '../badges/security-badge';
import { SpeakersTvsBadgeStrategy } from '../badges/speakers-tvs-badge';

/**
 * Strategy for heading cards that introduce a floor.
 */
export class FloorHeadingCardStrategy {
  /**
   * Generate the heading card for a floor.
   *
   * @param floor - The floor to represent.
   * @returns The card configuration.
   */
  static async generate(floor: Floor): Promise<LovelaceCardConfig> {
    return {
      type: 'heading',
      heading: floor.name,
      icon: floor.icon,
      tap_action: {
        action: 'navigate',
        navigation_path: `/${floor.uniqueIdentifier}`,
      },
      badges: await this.generateBadges(floor),
    };
  }

  /**
   * Build floor level badges for the heading card.
   *
   * @param floor - The floor to render.
   * @returns List of badges to show.
   */
  static async generateBadges(floor: Floor): Promise<LovelaceBadgeConfig[]> {
    const promises = [];

    if (floor.climateEntity) {
      promises.push(ClimateBadgeStrategy.generate(floor.climateEntity));
    }

    if (floor.lightEntity) {
      promises.push(LightsBadgeStrategy.generate(floor.lightEntity));
    }

    if (floor.lockEntity) {
      promises.push(SecurityBadgeStrategy.generate(floor.lockEntity));
    }

    if (floor.mediaPlayerEntity) {
      promises.push(SpeakersTvsBadgeStrategy.generate(floor.mediaPlayerEntity));
    }

    return [...(await Promise.all(promises))];
  }
}
