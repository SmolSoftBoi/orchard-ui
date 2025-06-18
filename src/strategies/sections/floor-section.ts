import { ClimateEntity, Floor, LightEntity } from '@smolpack/hasskit';
import { LovelaceCardConfig, LovelaceSectionRawConfig } from '../../lovelace';
import { ClimateCardStategy } from '../cards/climate-card';
import { FloorHeadingCardStrategy } from '../cards/floor-heading-card';
import { LightCardStrategy } from '../cards/light-card';
import { SecurityCardStrategy } from '../cards/security-card';
import { SpeakerTvCardStrategy } from '../cards/speaker-tv-card';
import { SwitchCardStrategy } from '../cards/switch-card';

/**
 * Build a section summarizing an entire floor.
 */
export class FloorSectionStrategy {
  /**
   * Generate a Lovelace section for the provided floor.
   *
   * @param floor - Floor to render.
   * @returns The section configuration.
   */
  static async generate(floor: Floor): Promise<LovelaceSectionRawConfig> {
    return {
      type: 'grid',
      cards: await this.generateCards(floor),
    };
  }

  /**
   * Create all cards belonging to the floor section.
   *
   * @param floor - Floor context.
   * @returns A list of cards.
   */
  static async generateCards(floor: Floor): Promise<LovelaceCardConfig[]> {
    const promises = [FloorHeadingCardStrategy.generate(floor)];

    for (const area of floor.areas) {
      for (const climateService of area.entitiesWithDomains([
        'climate',
      ]) as ClimateEntity[]) {
        promises.push(ClimateCardStategy.generate(climateService));
      }
    }

    for (const area of floor.areas) {
      if (area.lightEntityGroups.length > 0) {
        for (const lightEntity of area.lightEntityGroups) {
          promises.push(LightCardStrategy.generate(lightEntity));
        }
      } else {
        for (const lightEntity of area.entitiesWithDomains([
          'light',
        ]) as LightEntity[]) {
          promises.push(LightCardStrategy.generate(lightEntity));
        }
      }
    }

    for (const area of floor.areas) {
      const lockEntities = area.entitiesWithDomains(['lock']);

      if (lockEntities) {
        for (const lockEntity of lockEntities) {
          promises.push(SecurityCardStrategy.generate(lockEntity));
        }
      }
    }

    for (const room of floor.rooms) {
      const mediaPlayerEntities = room.entitiesWithDomains(['media_player']);

      if (mediaPlayerEntities) {
        for (const mediaPlayerEntity of mediaPlayerEntities) {
          promises.push(SpeakerTvCardStrategy.generate(mediaPlayerEntity));
        }
      }
    }

    for (const room of floor.rooms) {
      const switchEntities = room
        .entitiesWithDomains(['switch'])
        .filter((entity) => !entity.hidden);

      if (switchEntities) {
        for (const switchEntity of switchEntities) {
          promises.push(SwitchCardStrategy.generate(switchEntity));
        }
      }
    }

    return [...(await Promise.all(promises))];
  }
}
